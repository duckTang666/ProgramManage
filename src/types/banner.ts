// 轮播图信息
export interface Banner {
  id: string;
  image_url: string;        // 图片URL（从Supabase Storage获取）
  text_content: string;     // 文字内容
  link_url: string;        // 文字跳转链接
  display_order: number;     // 显示顺序（1-10，1的优先级最高）
  is_active: boolean;       // 是否启用（默认为true）
  created_at: string;       // 创建时间
  updated_at?: string;       // 更新时间
}

// 创建轮播图的请求数据
export interface CreateBannerRequest {
  image_url: string;
  text_content: string;
  link_url: string;
  display_order: number;
  is_active?: boolean;
}

// 更新轮播图的请求数据
export interface UpdateBannerRequest extends Partial<CreateBannerRequest> {
  updated_at?: string;
}

// 轮播图列表查询参数
export interface BannerFilters {
  search?: string;         // 搜索关键词
  is_active?: boolean;     // 是否启用
  page?: number;          // 页码
  limit?: number;         // 每页数量
}

// 轮播图列表响应
export interface BannerListResponse {
  data: Banner[];
  total: number;
  page: number;
  limit: number;
}

// 轮播图操作结果
export interface BannerOperationResult {
  success: boolean;
  message: string;
  data?: Banner;
}

// 轮播图状态映射
export const BANNER_STATUS_MAP: Record<boolean, string> = {
  true: '启用',
  false: '禁用'
};