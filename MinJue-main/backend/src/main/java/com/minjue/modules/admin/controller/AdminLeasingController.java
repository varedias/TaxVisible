package com.minjue.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.leasing.dto.LeasingRentOutDTO;
import com.minjue.modules.leasing.dto.LeasingTakeBackDTO;
import com.minjue.modules.leasing.dto.SupplierLeasingApplicationDTO;
import com.minjue.modules.leasing.entity.OmsLeasing;
import com.minjue.modules.leasing.entity.OmsLeasingApplication;
import com.minjue.modules.leasing.service.OmsLeasingApplicationService;
import com.minjue.modules.leasing.service.OmsLeasingService;
import com.minjue.modules.supplier.entity.OmsSupplier;
import com.minjue.modules.supplier.service.OmsSupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 租赁设备管理Controller
 */
@Tag(name = "Admin Leasing Management")
@RestController
@RequestMapping("/api/admin/leasing")
@RequiredArgsConstructor
public class AdminLeasingController {

    private final OmsLeasingService leasingService;
    private final OmsLeasingApplicationService applicationService;
    private final OmsSupplierService supplierService;

    @Operation(summary = "获取租赁设备列表")
    @GetMapping("/list")
    public Result<IPage<OmsLeasing>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer inventoryStatus,
            @RequestParam(required = false) String name) {

        Page<OmsLeasing> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<OmsLeasing> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(type)) {
            wrapper.eq(OmsLeasing::getType, type);
        }
        if (status != null) {
            wrapper.eq(OmsLeasing::getStatus, status);
        }
        if (inventoryStatus != null) {
            wrapper.eq(OmsLeasing::getInventoryStatus, inventoryStatus);
        }
        if (StringUtils.hasText(name)) {
            wrapper.and(w -> w.like(OmsLeasing::getName, name)
                              .or().like(OmsLeasing::getSupplier, name));
        }
        wrapper.orderByAsc(OmsLeasing::getInventoryStatus)
               .orderByDesc(OmsLeasing::getCreateTime);

        IPage<OmsLeasing> result = leasingService.page(pageParam, wrapper);
        return Result.success(result);
    }

    @Operation(summary = "获取租赁设备详情")
    @GetMapping("/{id}")
    public Result<OmsLeasing> getDetail(@PathVariable Long id) {
        OmsLeasing leasing = leasingService.getById(id);
        if (leasing == null) {
            return Result.error(404, "设备不存在");
        }
        return Result.success(leasing);
    }

    @Operation(summary = "创建租赁设备")
    @PostMapping("/create")
    public Result<String> create(@RequestBody OmsLeasing leasing) {
        syncSupplierInfo(leasing);
        leasing.setCreateTime(LocalDateTime.now());
        leasing.setUpdateTime(LocalDateTime.now());
        if (leasing.getStatus() == null) {
            leasing.setStatus(1);
        }
        if (leasing.getLeased() == null) {
            leasing.setLeased(0);
        }
        if (leasing.getInventoryStatus() == null) {
            leasing.setInventoryStatus(0);
        }
        leasingService.save(leasing);
        return Result.success("创建成功");
    }

    @Operation(summary = "更新租赁设备")
    @PutMapping("/{id}")
    public Result<String> update(@PathVariable Long id, @RequestBody OmsLeasing leasing) {
        OmsLeasing existing = leasingService.getById(id);
        if (existing == null) {
            return Result.error(404, "设备不存在");
        }
        mergeExistingFields(existing, leasing);
        syncSupplierInfo(leasing);
        leasing.setId(id);
        leasing.setCreateTime(existing.getCreateTime());
        leasing.setUpdateTime(LocalDateTime.now());
        leasingService.updateById(leasing);
        return Result.success("更新成功");
    }

    @Operation(summary = "删除租赁设备")
    @DeleteMapping("/{id}")
    public Result<String> delete(@PathVariable Long id) {
        OmsLeasing leasing = leasingService.getById(id);
        if (leasing == null) {
            return Result.error(404, "设备不存在");
        }
        leasingService.removeById(id);
        return Result.success("删除成功");
    }

    @Operation(summary = "更新设备状态")
    @PostMapping("/status")
    public Result<String> updateStatus(@RequestBody Map<String, Object> params) {
        Long id = Long.valueOf(params.get("id").toString());
        Integer status = Integer.valueOf(params.get("status").toString());

        OmsLeasing leasing = leasingService.getById(id);
        if (leasing == null) {
            return Result.error(404, "设备不存在");
        }

        leasing.setStatus(status);
        leasing.setUpdateTime(LocalDateTime.now());
        leasingService.updateById(leasing);

        return Result.success(status == 1 ? "已上架" : "已下架");
    }

    @Operation(summary = "租赁设备租出")
    @PostMapping("/{id}/rent-out")
    public Result<String> rentOut(@PathVariable Long id, @RequestBody LeasingRentOutDTO request) {
        OmsLeasing leasing = leasingService.getById(id);
        if (leasing == null) {
            return Result.error(404, "设备不存在");
        }
        if (leasing.getStatus() == null || leasing.getStatus() != 1) {
            return Result.error("请先上架设备后再执行租赁");
        }
        if (leasing.getInventoryStatus() != null && leasing.getInventoryStatus() == 1) {
            return Result.error("该设备当前已租出");
        }
        if (!StringUtils.hasText(request.getCompanyName())) {
            return Result.error("请填写承租企业");
        }
        if (!StringUtils.hasText(request.getContactName())) {
            return Result.error("请填写联系人");
        }
        if (!StringUtils.hasText(request.getContactPhone())) {
            return Result.error("请填写联系电话");
        }
        if (!StringUtils.hasText(request.getDeliveryAddress())) {
            return Result.error("请填写配送地址");
        }
        if (request.getLeaseStartDate() == null) {
            request.setLeaseStartDate(LocalDate.now());
        }
        if (!StringUtils.hasText(request.getLeasePeriod())) {
            request.setLeasePeriod("MONTH");
        }
        if (request.getLeaseDuration() == null || request.getLeaseDuration() < 1) {
            request.setLeaseDuration(1);
        }

        leasing.setInventoryStatus(1);
        leasing.setLesseeCompany(request.getCompanyName());
        leasing.setLesseeContactName(request.getContactName());
        leasing.setLesseeContactPhone(request.getContactPhone());
        leasing.setDeliveryAddress(request.getDeliveryAddress());
        leasing.setOnsiteAddress(request.getOnsiteAddress());
        leasing.setLeaseStartDate(request.getLeaseStartDate());
        leasing.setExpectedReturnDate(request.getExpectedReturnDate());
        leasing.setCurrentLeasePeriod(request.getLeasePeriod());
        leasing.setCurrentLeaseDuration(request.getLeaseDuration());
        leasing.setCurrentRentalAmount(resolveRentalAmount(leasing, request));
        leasing.setRentalRemark(request.getRemark());
        leasing.setLeased((leasing.getLeased() == null ? 0 : leasing.getLeased()) + 1);
        leasing.setReturnAddress(null);
        leasing.setReturnReceiverName(null);
        leasing.setEquipmentCondition(null);
        leasing.setReturnNote(null);
        leasing.setReturnDate(null);
        leasing.setUpdateTime(LocalDateTime.now());
        leasingService.updateById(leasing);

        return Result.success("设备已租出");
    }

    @Operation(summary = "租赁设备收回")
    @PostMapping("/{id}/take-back")
    public Result<String> takeBack(@PathVariable Long id, @RequestBody LeasingTakeBackDTO request) {
        OmsLeasing leasing = leasingService.getById(id);
        if (leasing == null) {
            return Result.error(404, "设备不存在");
        }
        if (leasing.getInventoryStatus() == null || leasing.getInventoryStatus() != 1) {
            return Result.error("该设备当前未租出");
        }

        leasing.setInventoryStatus(0);
        leasing.setReturnDate(request.getReturnDate() == null ? LocalDate.now() : request.getReturnDate());
        leasing.setReturnAddress(request.getReturnAddress());
        leasing.setReturnReceiverName(request.getReceiverName());
        leasing.setEquipmentCondition(request.getEquipmentCondition());
        leasing.setReturnNote(request.getNote());
        leasing.setLesseeCompany(null);
        leasing.setLesseeContactName(null);
        leasing.setLesseeContactPhone(null);
        leasing.setDeliveryAddress(null);
        leasing.setOnsiteAddress(null);
        leasing.setLeaseStartDate(null);
        leasing.setExpectedReturnDate(null);
        leasing.setCurrentLeasePeriod(null);
        leasing.setCurrentLeaseDuration(null);
        leasing.setCurrentRentalAmount(null);
        leasing.setRentalRemark(null);
        leasing.setUpdateTime(LocalDateTime.now());
        leasingService.updateById(leasing);

        return Result.success("设备已收回");
    }

    // ==================== 租赁申请管理 ====================

    @Operation(summary = "获取租赁申请列表")
    @GetMapping("/applications")
    public Result<Map<String, Object>> getApplications(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword) {

        Page<OmsLeasingApplication> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<OmsLeasingApplication> wrapper = new LambdaQueryWrapper<>();

        if (status != null) {
            wrapper.eq(OmsLeasingApplication::getStatus, status);
        }
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(OmsLeasingApplication::getCompanyName, keyword)
                              .or().like(OmsLeasingApplication::getContactName, keyword)
                              .or().like(OmsLeasingApplication::getContactPhone, keyword));
        }
        wrapper.orderByDesc(OmsLeasingApplication::getCreateTime);

        IPage<OmsLeasingApplication> result = applicationService.page(pageParam, wrapper);
        List<Long> leasingIds = result.getRecords().stream().map(OmsLeasingApplication::getLeasingId).distinct().toList();
        Map<Long, OmsLeasing> leasingMap = leasingIds.isEmpty()
                ? Map.of()
                : leasingService.listByIds(leasingIds).stream().collect(Collectors.toMap(OmsLeasing::getId, Function.identity()));

        List<SupplierLeasingApplicationDTO> records = result.getRecords().stream().map(item -> {
            OmsLeasing leasing = leasingMap.get(item.getLeasingId());
            SupplierLeasingApplicationDTO dto = new SupplierLeasingApplicationDTO();
            dto.setId(item.getId());
            dto.setLeasingId(item.getLeasingId());
            dto.setLeasingName(leasing != null ? leasing.getName() : "未知设备");
            dto.setLeasingType(leasing != null ? leasing.getType() : null);
            dto.setLeasingImage(leasing != null ? leasing.getImage() : null);
            dto.setSupplierId(leasing != null ? leasing.getSupplierId() : null);
            dto.setSupplierName(leasing != null ? leasing.getSupplier() : null);
            dto.setInventoryStatus(leasing != null ? leasing.getInventoryStatus() : null);
            dto.setLeaseType(item.getLeaseType());
            dto.setLeasePeriod(item.getLeasePeriod());
            dto.setLeaseDuration(item.getLeaseDuration());
            dto.setEstimatedCost(item.getEstimatedCost());
            dto.setCompanyName(item.getCompanyName());
            dto.setContactName(item.getContactName());
            dto.setContactPhone(item.getContactPhone());
            dto.setDeliveryAddress(item.getDeliveryAddress());
            dto.setOnsiteAddress(item.getOnsiteAddress());
            dto.setExpectedStartDate(item.getExpectedStartDate());
            dto.setRemark(item.getRemark());
            dto.setStatus(item.getStatus());
            dto.setCreateTime(item.getCreateTime());
            dto.setUpdateTime(item.getUpdateTime());
            return dto;
        }).toList();

        return Result.success(buildPageResult(result, records));
    }

    @Operation(summary = "审核租赁申请")
    @PostMapping("/applications/review")
    public Result<String> reviewApplication(@RequestBody Map<String, Object> params) {
        Long id = Long.valueOf(params.get("id").toString());
        Integer reviewStatus = Integer.valueOf(params.get("status").toString());

        OmsLeasingApplication application = applicationService.getById(id);
        if (application == null) {
            return Result.error(404, "申请不存在");
        }

        application.setStatus(reviewStatus);
        application.setUpdateTime(LocalDateTime.now());
        applicationService.updateById(application);

        String msg = reviewStatus == 1 ? "已通过" : "已驳回";
        return Result.success(msg);
    }

    private void mergeExistingFields(OmsLeasing existing, OmsLeasing target) {
        if (target.getSupplierId() == null) {
            target.setSupplierId(existing.getSupplierId());
        }
        if (target.getBenefits() == null) {
            target.setBenefits(existing.getBenefits());
        }
        if (target.getTags() == null) {
            target.setTags(existing.getTags());
        }
        if (target.getLeased() == null) {
            target.setLeased(existing.getLeased());
        }
        if (target.getRating() == null) {
            target.setRating(existing.getRating());
        }
        if (target.getInventoryStatus() == null) {
            target.setInventoryStatus(existing.getInventoryStatus());
        }
        if (target.getLesseeCompany() == null) {
            target.setLesseeCompany(existing.getLesseeCompany());
        }
        if (target.getLesseeContactName() == null) {
            target.setLesseeContactName(existing.getLesseeContactName());
        }
        if (target.getLesseeContactPhone() == null) {
            target.setLesseeContactPhone(existing.getLesseeContactPhone());
        }
        if (target.getDeliveryAddress() == null) {
            target.setDeliveryAddress(existing.getDeliveryAddress());
        }
        if (target.getOnsiteAddress() == null) {
            target.setOnsiteAddress(existing.getOnsiteAddress());
        }
        if (target.getLeaseStartDate() == null) {
            target.setLeaseStartDate(existing.getLeaseStartDate());
        }
        if (target.getExpectedReturnDate() == null) {
            target.setExpectedReturnDate(existing.getExpectedReturnDate());
        }
        if (target.getCurrentLeasePeriod() == null) {
            target.setCurrentLeasePeriod(existing.getCurrentLeasePeriod());
        }
        if (target.getCurrentLeaseDuration() == null) {
            target.setCurrentLeaseDuration(existing.getCurrentLeaseDuration());
        }
        if (target.getCurrentRentalAmount() == null) {
            target.setCurrentRentalAmount(existing.getCurrentRentalAmount());
        }
        if (target.getRentalRemark() == null) {
            target.setRentalRemark(existing.getRentalRemark());
        }
        if (target.getReturnAddress() == null) {
            target.setReturnAddress(existing.getReturnAddress());
        }
        if (target.getReturnReceiverName() == null) {
            target.setReturnReceiverName(existing.getReturnReceiverName());
        }
        if (target.getEquipmentCondition() == null) {
            target.setEquipmentCondition(existing.getEquipmentCondition());
        }
        if (target.getReturnNote() == null) {
            target.setReturnNote(existing.getReturnNote());
        }
        if (target.getReturnDate() == null) {
            target.setReturnDate(existing.getReturnDate());
        }

        if (!StringUtils.hasText(target.getWarehouseAddress())) {
            target.setWarehouseAddress(existing.getWarehouseAddress());
        }
        if (target.getStatus() == null) {
            target.setStatus(existing.getStatus());
        }
    }

    private BigDecimal resolveRentalAmount(OmsLeasing leasing, LeasingRentOutDTO request) {
        if (request.getRentalAmount() != null) {
            return request.getRentalAmount();
        }

        BigDecimal unitPrice = leasing.getMonthlyPrice() == null ? BigDecimal.ZERO : leasing.getMonthlyPrice();
        if ("DAY".equalsIgnoreCase(request.getLeasePeriod())) {
            unitPrice = leasing.getDailyPrice() == null ? BigDecimal.ZERO : leasing.getDailyPrice();
        } else if ("WEEK".equalsIgnoreCase(request.getLeasePeriod())) {
            unitPrice = leasing.getWeeklyPrice() == null ? BigDecimal.ZERO : leasing.getWeeklyPrice();
        }

        return unitPrice.multiply(BigDecimal.valueOf(request.getLeaseDuration() == null ? 1 : request.getLeaseDuration()));
    }

    private void syncSupplierInfo(OmsLeasing leasing) {
        if (leasing == null) {
            return;
        }
        OmsSupplier supplier = null;
        if (leasing.getSupplierId() != null) {
            supplier = supplierService.getById(leasing.getSupplierId());
        }
        if (supplier == null && StringUtils.hasText(leasing.getSupplier())) {
            supplier = supplierService.getOne(
                    new LambdaQueryWrapper<OmsSupplier>().eq(OmsSupplier::getName, leasing.getSupplier()).last("LIMIT 1")
            );
        }
        if (supplier != null) {
            leasing.setSupplierId(supplier.getId());
            leasing.setSupplier(supplier.getName());
        }
    }

    private Map<String, Object> buildPageResult(IPage<?> page, List<?> records) {
        Map<String, Object> result = new HashMap<>();
        result.put("records", records);
        result.put("total", page.getTotal());
        result.put("current", page.getCurrent());
        result.put("size", page.getSize());
        result.put("pages", page.getPages());
        return result;
    }
}
