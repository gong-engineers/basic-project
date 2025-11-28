import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartInDto } from './dto/request/cart-in.dto';
import { CartUpdateDto } from './dto/request/cart-update.dto';
// import { CartInfoDto} from "./dto/cart-info.dto";
import { ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { type AccessRequest } from '../auth/interfaces/jwt-payload.interface';

@Controller('api/v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // 장바구니 담기
  @ApiOperation({ summary: '장바구니 담기' })
  @ApiBody({ type: CartInDto })
  @ApiResponse({ status: 200, description: '장바구니 담기 성공' })
  @ApiResponse({ status: 400, description: '장바구니 담기 실패' })
  @UseGuards(JwtAuthGuard) // JWT 토큰 검증 가드
  @Post()
  cartIn(@Request() request: AccessRequest, @Body() cartInDto: CartInDto) {
    return this.cartService.cartIn(request, cartInDto);
  }

  // 장바구니 리스트 조회
  @ApiOperation({ summary: '장바구니 리스트 조회' })
  @ApiResponse({ status: 200, description: '장바구니 리스트 호출 성공' })
  @ApiResponse({ status: 400, description: '장바구니 리스트 호출 실패' })
  @UseGuards(JwtAuthGuard) // JWT 토큰 검증 가드
  @Get()
  cartList(@Request() request: AccessRequest) {
    return this.cartService.cartList(request);
  }

  // 장바구니 수정
  @ApiOperation({ summary: '장바구니 수정' })
  @ApiBody({ type: CartUpdateDto })
  @ApiResponse({ status: 200, description: '장바구니 수정 성공' })
  @ApiResponse({ status: 400, description: '장바구니 수정 실패' })
  @UseGuards(JwtAuthGuard) // JWT 토큰 검증 가드
  @Put()
  cartUpdate(
    @Request() request: AccessRequest,
    @Body() cartUpdateDto: CartUpdateDto,
  ) {
    return this.cartService.cartUpdate(request, cartUpdateDto);
  }

  // 장바구니 삭제
  @ApiOperation({ summary: '장바구니 삭제' })
  @ApiParam({ name: 'cartId', description: '장바구니 ID' })
  @ApiResponse({ status: 200, description: '장바구니 삭제 성공' })
  @ApiResponse({ status: 400, description: '장바구니 삭제 실패' })
  @UseGuards(JwtAuthGuard) // JWT 토큰 검증 가드
  @Delete(':cartId')
  cartDelete(
    @Request() request: AccessRequest,
    @Param('cartId') cartId: number,
  ) {
    return this.cartService.cartDelete(request, cartId);
  }
}
