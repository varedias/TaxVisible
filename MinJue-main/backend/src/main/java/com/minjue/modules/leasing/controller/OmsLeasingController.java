package com.minjue.modules.leasing.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.leasing.dto.LeasingApplicationReviewDTO;
import com.minjue.modules.leasing.dto.SupplierLeasingApplicationDTO;
import com.minjue.modules.leasing.entity.OmsLeasing;
import com.minjue.modules.leasing.entity.OmsLeasingApplication;
import com.minjue.modules.message.entity.OmsMessage;
import com.minjue.modules.message.service.OmsMessageService;
import com.minjue.modules.supplier.entity.OmsSupplier;
import com.minjue.modules.supplier.service.OmsSupplierService;
import com.minjue.modules.leasing.service.OmsLeasingApplicationService;
import com.minjue.modules.leasing.service.OmsLeasingService;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 用户端租赁设备Controller
 */
@Tag(name = "Leasing API")
@RestController
@RequestMapping("/api/v1/leasing")
@RequiredArgsConstructor
public class OmsLeasingController {

    private final OmsLeasingService leasingService;
    private final OmsLeasingApplicationService applicationService;
    private final SysUserService sysUserService;
    private final OmsSupplierService supplierService;
    private final OmsMessageService messageService;

    @Operation(summary = "获取租赁设备列表（用户端）")
    @GetMapping("/list")
    public Result<IPage<OmsLeasing>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "12") Integer size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer status) {

        Page<OmsLeasing> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<OmsLeasing> wrapper = new LambdaQueryWrapper<>();

        // 默认只显示上架设备
        if (status != null) {
            wrapper.eq(OmsLeasing::getStatus, status);
        } else {
            wrapper.eq(OmsLeasing::getStatus, 1);
        }

        // 类型筛选
        if (StringUtils.hasText(type)) {
            wrapper.eq(OmsLeasing::getType, type);
        }

        // 关键词搜索
        if (StringUtils.hasText(name)) {
            wrapper.and(w -> w.like(OmsLeasing::getName, name)
                              .or().like(OmsLeasing::getSupplier, name));
        }

        wrapper.orderByAsc(OmsLeasing::getInventoryStatus)
               .orderByDesc(OmsLeasing::getLeased);

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

    // ==================== 租赁申请接口 ====================

    @Operation(summary = "提交租赁申请")
    @PostMapping("/apply")
    public Result<String> apply(@RequestBody OmsLeasingApplication application, Principal principal) {
        SysUser user = getUserByPrincipal(principal);
        if (user == null) {
            return Result.error(401, "用户不存在");
        }

        // 验证设备是否存在
        OmsLeasing leasing = leasingService.getById(application.getLeasingId());
        if (leasing == null) {
            return Result.error(404, "租赁设备不存在");
        }
        if (leasing.getStatus() == null || leasing.getStatus() != 1) {
            return Result.error("该设备暂未上架");
        }
        if (leasing.getInventoryStatus() != null && leasing.getInventoryStatus() == 1) {
            return Result.error("该设备当前已租出");
        }
        if (!StringUtils.hasText(application.getCompanyName())) {
            return Result.error("请填写企业名称");
        }
        if (!StringUtils.hasText(application.getContactName())) {
            return Result.error("请填写联系人");
        }
        if (!StringUtils.hasText(application.getContactPhone())) {
            return Result.error("请填写联系电话");
        }
        if (!StringUtils.hasText(application.getDeliveryAddress())) {
            return Result.error("请填写配送地址");
        }

        application.setUserId(user.getId());
        application.setStatus(0); // 待审核
        application.setCreateTime(LocalDateTime.now());
        application.setUpdateTime(LocalDateTime.now());
        applicationService.save(application);

        OmsSupplier supplier = resolveSupplierByLeasing(leasing);
        if (supplier != null && supplier.getUserId() != null) {
            sendSystemMessage(
                    user.getId(),
                    supplier.getUserId(),
                    supplier.getId(),
                    false,
                    String.format("收到新的租赁申请：%s 申请租赁设备「%s」，联系人：%s，电话：%s。",
                            application.getCompanyName(),
                            leasing.getName(),
                            application.getContactName(),
                            application.getContactPhone())
            );
        }
        notifyAdmins(
                user.getId(),
                supplier != null ? supplier.getId() : leasing.getSupplierId(),
                false,
                String.format("新的租赁申请待处理：设备「%s」，申请企业「%s」，请前往租赁管理查看。",
                        leasing.getName(),
                        application.getCompanyName())
        );

        return Result.success("申请已提交，请等待审核");
    }

    @Operation(summary = "获取我的租赁申请")
    @GetMapping("/applications")
    public Result<IPage<OmsLeasingApplication>> getMyApplications(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            Principal principal) {

        SysUser user = getUserByPrincipal(principal);
        if (user == null) {
            return Result.error(401, "用户不存在");
        }

        Page<OmsLeasingApplication> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<OmsLeasingApplication> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OmsLeasingApplication::getUserId, user.getId())
               .orderByDesc(OmsLeasingApplication::getCreateTime);

        IPage<OmsLeasingApplication> result = applicationService.page(pageParam, wrapper);
        return Result.success(result);
    }

    @Operation(summary = "供应商获取自己的租赁申请列表")
    @GetMapping("/supplier/applications")
    public Result<Map<String, Object>> getSupplierApplications(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword,
            Principal principal) {
        OmsSupplier supplier = getSupplierByPrincipal(principal);
        if (supplier == null) {
            return Result.error(403, "仅供应商可查看");
        }

        List<OmsLeasing> leasingList = leasingService.list(
                new LambdaQueryWrapper<OmsLeasing>()
                        .eq(OmsLeasing::getSupplierId, supplier.getId())
                        .orderByDesc(OmsLeasing::getCreateTime)
        );
        List<Long> leasingIds = leasingList.stream().map(OmsLeasing::getId).filter(Objects::nonNull).toList();
        if (leasingIds.isEmpty()) {
            return Result.success(buildPageResult(new Page<>(page, size), List.of()));
        }

        Page<OmsLeasingApplication> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<OmsLeasingApplication> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(OmsLeasingApplication::getLeasingId, leasingIds);
        if (status != null) {
            wrapper.eq(OmsLeasingApplication::getStatus, status);
        }
        if (org.springframework.util.StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(OmsLeasingApplication::getCompanyName, keyword)
                    .or().like(OmsLeasingApplication::getContactName, keyword)
                    .or().like(OmsLeasingApplication::getContactPhone, keyword));
        }
        wrapper.orderByAsc(OmsLeasingApplication::getStatus)
               .orderByDesc(OmsLeasingApplication::getCreateTime);

        IPage<OmsLeasingApplication> result = applicationService.page(pageParam, wrapper);
        Map<Long, OmsLeasing> leasingMap = leasingList.stream().collect(Collectors.toMap(OmsLeasing::getId, item -> item));
        List<SupplierLeasingApplicationDTO> records = result.getRecords().stream()
                .map(item -> toSupplierApplicationDTO(item, leasingMap.get(item.getLeasingId()), supplier))
                .toList();

        return Result.success(buildPageResult(result, records));
    }

    @Operation(summary = "供应商审核租赁申请")
    @PostMapping("/supplier/applications/{id}/review")
    public Result<String> reviewSupplierApplication(
            @PathVariable Long id,
            @RequestBody LeasingApplicationReviewDTO request,
            Principal principal) {
        OmsSupplier supplier = getSupplierByPrincipal(principal);
        SysUser currentUser = getUserByPrincipal(principal);
        if (supplier == null || currentUser == null) {
            return Result.error(403, "仅供应商可操作");
        }

        OmsLeasingApplication application = applicationService.getById(id);
        if (application == null) {
            return Result.error(404, "申请不存在");
        }
        OmsLeasing leasing = leasingService.getById(application.getLeasingId());
        if (leasing == null) {
            return Result.error(404, "租赁设备不存在");
        }

        OmsSupplier leasingSupplier = resolveSupplierByLeasing(leasing);
        if (leasingSupplier == null || !Objects.equals(leasingSupplier.getId(), supplier.getId())) {
            return Result.error(403, "无权审核该申请");
        }
        if (application.getStatus() != null && application.getStatus() != 0) {
            return Result.error("该申请已处理");
        }
        if (request.getStatus() == null || (request.getStatus() != 1 && request.getStatus() != 2)) {
            return Result.error("审核状态不正确");
        }

        if (request.getStatus() == 1) {
            if (leasing.getStatus() == null || leasing.getStatus() != 1) {
                return Result.error("设备未上架，无法通过并租出");
            }
            if (leasing.getInventoryStatus() != null && leasing.getInventoryStatus() == 1) {
                return Result.error("设备当前已租出");
            }
        }

        application.setStatus(request.getStatus());
        application.setUpdateTime(LocalDateTime.now());
        applicationService.updateById(application);

        if (request.getStatus() == 1) {

            LocalDate leaseStartDate = application.getExpectedStartDate() == null ? LocalDate.now() : application.getExpectedStartDate();
            leasing.setInventoryStatus(1);
            leasing.setLesseeCompany(application.getCompanyName());
            leasing.setLesseeContactName(application.getContactName());
            leasing.setLesseeContactPhone(application.getContactPhone());
            leasing.setDeliveryAddress(application.getDeliveryAddress());
            leasing.setOnsiteAddress(application.getOnsiteAddress());
            leasing.setLeaseStartDate(leaseStartDate);
            leasing.setExpectedReturnDate(calculateExpectedReturnDate(
                    leaseStartDate,
                    application.getLeasePeriod(),
                    application.getLeaseDuration()
            ));
            leasing.setCurrentLeasePeriod(application.getLeasePeriod());
            leasing.setCurrentLeaseDuration(application.getLeaseDuration());
            leasing.setCurrentRentalAmount(application.getEstimatedCost() == null ? BigDecimal.ZERO : application.getEstimatedCost());
            leasing.setRentalRemark(application.getRemark());
            leasing.setLeased((leasing.getLeased() == null ? 0 : leasing.getLeased()) + 1);
            leasing.setUpdateTime(LocalDateTime.now());
            leasingService.updateById(leasing);
        }

        notifyApplicantAndAdminsAfterReview(currentUser, supplier, leasing, application, request.getStatus());
        return Result.success(request.getStatus() == 1 ? "已通过并完成租赁" : "已驳回该租赁申请");
    }

    private SysUser getUserByPrincipal(Principal principal) {
        if (principal == null) {
            return null;
        }
        return sysUserService.getOne(
                new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName())
        );
    }

    private OmsSupplier getSupplierByPrincipal(Principal principal) {
        SysUser user = getUserByPrincipal(principal);
        if (user == null) {
            return null;
        }
        return supplierService.getOne(
                new LambdaQueryWrapper<OmsSupplier>().eq(OmsSupplier::getUserId, user.getId())
        );
    }

    private OmsSupplier resolveSupplierByLeasing(OmsLeasing leasing) {
        if (leasing == null) {
            return null;
        }
        if (leasing.getSupplierId() != null) {
            OmsSupplier supplier = supplierService.getById(leasing.getSupplierId());
            if (supplier != null) {
                return supplier;
            }
        }
        if (StringUtils.hasText(leasing.getSupplier())) {
            return supplierService.getOne(
                    new LambdaQueryWrapper<OmsSupplier>().eq(OmsSupplier::getName, leasing.getSupplier()).last("LIMIT 1")
            );
        }
        return null;
    }

    private void sendSystemMessage(Long senderId, Long receiverId, Long supplierId, boolean isFromSupplier, String content) {
        if (receiverId == null || senderId == null) {
            return;
        }
        OmsMessage message = new OmsMessage();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setSupplierId(supplierId == null ? 0L : supplierId);
        message.setContent(content);
        message.setMessageType("TEXT");
        message.setIsFromSupplier(isFromSupplier);
        message.setIsRead(false);
        message.setCreateTime(LocalDateTime.now());
        messageService.save(message);
    }

    private void notifyAdmins(Long senderId, Long supplierId, boolean isFromSupplier, String content) {
        List<SysUser> admins = sysUserService.list(new LambdaQueryWrapper<SysUser>().eq(SysUser::getRole, "ADMIN"));
        admins.forEach(admin -> sendSystemMessage(senderId, admin.getId(), supplierId, isFromSupplier, content));
    }

    private void notifyApplicantAndAdminsAfterReview(SysUser currentUser, OmsSupplier supplier, OmsLeasing leasing, OmsLeasingApplication application, Integer reviewStatus) {
        String applicantMessage = reviewStatus == 1
                ? String.format("你的租赁申请已通过：设备「%s」已确认租出，供应商「%s」将与你继续对接交付。",
                leasing.getName(),
                supplier.getName())
                : String.format("你的租赁申请未通过：设备「%s」当前未能安排租赁，请联系供应商「%s」了解详情。",
                leasing.getName(),
                supplier.getName());

        sendSystemMessage(
                currentUser.getId(),
                application.getUserId(),
                supplier.getId(),
                true,
                applicantMessage
        );

        String adminMessage = reviewStatus == 1
                ? String.format("供应商已通过租赁申请：设备「%s」已租给「%s」。", leasing.getName(), application.getCompanyName())
                : String.format("供应商已驳回租赁申请：设备「%s」，申请企业「%s」。", leasing.getName(), application.getCompanyName());

        notifyAdmins(currentUser.getId(), supplier.getId(), true, adminMessage);
    }

    private LocalDate calculateExpectedReturnDate(LocalDate startDate, String leasePeriod, Integer leaseDuration) {
        if (startDate == null || leaseDuration == null || leaseDuration <= 0) {
            return null;
        }
        if ("DAY".equalsIgnoreCase(leasePeriod)) {
            return startDate.plusDays(leaseDuration.longValue());
        }
        if ("WEEK".equalsIgnoreCase(leasePeriod)) {
            return startDate.plusWeeks(leaseDuration.longValue());
        }
        return startDate.plusMonths(leaseDuration.longValue());
    }

    private SupplierLeasingApplicationDTO toSupplierApplicationDTO(OmsLeasingApplication application, OmsLeasing leasing, OmsSupplier supplier) {
        SupplierLeasingApplicationDTO dto = new SupplierLeasingApplicationDTO();
        dto.setId(application.getId());
        dto.setLeasingId(application.getLeasingId());
        dto.setLeasingName(leasing != null ? leasing.getName() : "未知设备");
        dto.setLeasingType(leasing != null ? leasing.getType() : null);
        dto.setLeasingImage(leasing != null ? leasing.getImage() : null);
        dto.setSupplierId(supplier != null ? supplier.getId() : null);
        dto.setSupplierName(supplier != null ? supplier.getName() : null);
        dto.setInventoryStatus(leasing != null ? leasing.getInventoryStatus() : null);
        dto.setLeaseType(application.getLeaseType());
        dto.setLeasePeriod(application.getLeasePeriod());
        dto.setLeaseDuration(application.getLeaseDuration());
        dto.setEstimatedCost(application.getEstimatedCost());
        dto.setCompanyName(application.getCompanyName());
        dto.setContactName(application.getContactName());
        dto.setContactPhone(application.getContactPhone());
        dto.setDeliveryAddress(application.getDeliveryAddress());
        dto.setOnsiteAddress(application.getOnsiteAddress());
        dto.setExpectedStartDate(application.getExpectedStartDate());
        dto.setRemark(application.getRemark());
        dto.setStatus(application.getStatus());
        dto.setCreateTime(application.getCreateTime());
        dto.setUpdateTime(application.getUpdateTime());
        return dto;
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
