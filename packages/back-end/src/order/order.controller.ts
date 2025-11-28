import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderService } from './order.service';
import { type AccessRequest } from '../auth/interfaces/jwt-payload.interface';
import { OrderRequestDto } from './dto/request/order-request.dto';
import { PurchaseConfirmRequestDto } from './dto/response/purchase-confirm-request.dto';

@Controller('api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 결제 진행
  @ApiOperation({ summary: '결제 진행' })
  @ApiBody({ type: OrderRequestDto })
  @ApiResponse({ status: 200, description: '결제 진행 성공' })
  @ApiResponse({ status: 400, description: '결제 진행 실패' })
  @UseGuards(JwtAuthGuard)
  @Post()
  orderProgress(
    @Request() request: AccessRequest,
    @Body() orderRequestDto: OrderRequestDto,
  ) {
    return this.orderService.orderProgress(request, orderRequestDto);
  }

  // 결제 주문 이력 리스트 조회
  @ApiOperation({ summary: '결제 주문 이력 리스트 조회' })
  @ApiResponse({ status: 200, description: '결제 주문 이력 리스트 조회 성공' })
  @ApiResponse({ status: 400, description: '결제 주문 이력 리스트 조회 실패' })
  @UseGuards(JwtAuthGuard)
  @Get()
  orderInfoList(@Request() request: AccessRequest) {
    return this.orderService.orderInfoList(request);
  }

  // 결제 주문 확정 처리
  @ApiOperation({ summary: '결제 주문 확정 처리' })
  @ApiBody({ type: PurchaseConfirmRequestDto })
  @ApiResponse({ status: 200, description: '결제 주문 확정 처리 성공' })
  @ApiResponse({ status: 400, description: '결제 주문 확정 처리 실패' })
  @UseGuards(JwtAuthGuard)
  @Patch('purchase-confirm')
  purchaseConfirm(
    @Request() request: AccessRequest,
    @Body() purchaseConfirmRequestDto: PurchaseConfirmRequestDto,
  ) {
    return this.orderService.purchaseConfirm(
      request,
      purchaseConfirmRequestDto,
    );
  }
}
