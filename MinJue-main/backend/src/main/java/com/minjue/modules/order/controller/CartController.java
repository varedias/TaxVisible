package com.minjue.modules.order.controller;

import com.minjue.common.result.Result;
import com.minjue.modules.order.dto.CartItemDTO;
import com.minjue.modules.order.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Tag(name = "Shopping Cart")
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 临时用户ID (实际应从 JWT 解析)
    private Long getUserId(Principal principal) {
        // TODO: 从 principal 获取真实用户ID
        return 1L;
    }

    @Operation(summary = "Get Cart Items")
    @GetMapping
    public Result<List<CartItemDTO>> getCart(Principal principal) {
        return Result.success(cartService.getCartItems(getUserId(principal)));
    }

    @Operation(summary = "Add to Cart")
    @PostMapping("/add")
    public Result<String> addToCart(
            Principal principal,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        cartService.addToCart(getUserId(principal), productId, quantity);
        return Result.success("Added to cart");
    }

    @Operation(summary = "Update Quantity")
    @PutMapping("/update")
    public Result<String> updateQuantity(
            Principal principal,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        cartService.updateQuantity(getUserId(principal), productId, quantity);
        return Result.success("Updated successfully");
    }

    @Operation(summary = "Remove from Cart")
    @DeleteMapping("/remove/{productId}")
    public Result<String> removeFromCart(Principal principal, @PathVariable Long productId) {
        cartService.removeFromCart(getUserId(principal), productId);
        return Result.success("Removed from cart");
    }

    @Operation(summary = "Clear Cart")
    @DeleteMapping("/clear")
    public Result<String> clearCart(Principal principal) {
        cartService.clearCart(getUserId(principal));
        return Result.success("Cart cleared");
    }
}
