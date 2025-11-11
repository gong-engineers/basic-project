import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderService } from './order.service';
import { type AccessRequest } from '../auth/interfaces/jwt-payload.interface';
import { OrderRequestDto } from './dto/request/order-request.dto';

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
}
