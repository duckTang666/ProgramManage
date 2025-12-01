import { supabase } from './supabase';
import { 
  Banner, 
  CreateBannerRequest, 
  UpdateBannerRequest, 
  BannerFilters, 
  BannerListResponse, 
  BannerOperationResult 
} from '../types/banner';

export class BannerService {
  // 获取轮播图列表
  static async getBanners(filters: BannerFilters = {}): Promise<{ success: boolean; data?: BannerListResponse; message?: string }> {
    try {
      let query = supabase
        .from('banners')
        .select('*', { count: 'exact' })
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      // 应用搜索过滤
      if (filters.search) {
        query = query.or(`text_content.ilike.%${filters.search}%,link_url.ilike.%${filters.search}%`);
      }

      // 应用状态过滤
      if (typeof filters.is_active === 'boolean') {
        query = query.eq('is_active', filters.is_active);
      }

      // 分页处理
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;

      if (limit) {
        query = query.range(offset, offset + limit - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
          ? (error as { message: string }).message 
          : String(error);
        throw new Error(errorMessage);
      }

      const response: BannerListResponse = {
        data: data || [],
        total: count || 0,
        page,
        limit
      };

      return { success: true, data: response };
    } catch (error) {
      console.error('Error fetching banners:', error);
      return { success: false, message: error instanceof Error ? error.message : '获取轮播图列表失败' };
    }
  }

  // 获取单个轮播图详情
  static async getBannerById(id: string): Promise<{ success: boolean; data?: Banner; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, message: '轮播图不存在' };
        }
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching banner:', error);
      return { success: false, message: error instanceof Error ? error.message : '获取轮播图详情失败' };
    }
  }

  // 创建轮播图
  static async createBanner(bannerData: CreateBannerRequest): Promise<BannerOperationResult> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert([{
          ...bannerData,
          is_active: bannerData.is_active !== undefined ? bannerData.is_active : true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
          ? (error as { message: string }).message 
          : String(error);
        throw new Error(errorMessage);
      }

      return { 
        success: true, 
        message: '轮播图创建成功',
        data 
      };
    } catch (error) {
      console.error('Error creating banner:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : '创建轮播图失败' 
      };
    }
  }

  // 更新轮播图
  static async updateBanner(id: string, updateData: UpdateBannerRequest): Promise<BannerOperationResult> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, message: '轮播图不存在' };
        }
        throw new Error(error.message);
      }

      return { 
        success: true, 
        message: '轮播图更新成功',
        data 
      };
    } catch (error) {
      console.error('Error updating banner:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : '更新轮播图失败' 
      };
    }
  }

  // 删除轮播图
  static async deleteBanner(id: string): Promise<BannerOperationResult> {
    try {
      // 先获取轮播图信息，用于删除关联的Storage文件
      const { data: banner, error: fetchError } = await supabase
        .from('banners')
        .select('image_url')
        .eq('id', id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return { success: false, message: '轮播图不存在' };
        }
        throw new Error(fetchError.message);
      }

      // 删除数据库记录
      const { error: deleteError } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // 尝试删除Storage中的图片文件
      if (banner?.image_url) {
        try {
          // 从URL中提取文件路径
          const url = new URL(banner.image_url);
          const pathname = url.pathname;
          // 移除 /storage/v1/object/public/ 前缀
          const filePath = pathname.replace(/^\/storage\/v1\/object\/public\//, '');
          
          if (filePath) {
            const bucketName = filePath.split('/')[0];
            const objectPath = filePath.substring(bucketName.length + 1);
            
            await supabase.storage
              .from(bucketName)
              .remove([objectPath]);
              
            console.log(`已删除Storage文件: ${objectPath}`);
          }
        } catch (storageError) {
          console.warn('删除Storage文件失败:', storageError);
          // 不影响主要删除操作
        }
      }

      return { 
        success: true, 
        message: '轮播图删除成功' 
      };
    } catch (error) {
      console.error('Error deleting banner:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : '删除轮播图失败' 
      };
    }
  }

  // 更新轮播图状态（启用/禁用）
  static async updateBannerStatus(id: string, isActive: boolean): Promise<BannerOperationResult> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, message: '轮播图不存在' };
        }
        throw new Error(error.message);
      }

      const statusText = isActive ? '启用' : '禁用';
      return { 
        success: true, 
        message: `轮播图${statusText}成功`,
        data 
      };
    } catch (error) {
      console.error('Error updating banner status:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : '更新轮播图状态失败' 
      };
    }
  }

  // 批量更新轮播图排序
  static async updateBannerOrder(updates: { id: string; display_order: number }[]): Promise<BannerOperationResult> {
    try {
      const promises = updates.map(update => 
        supabase
          .from('banners')
          .update({ 
            display_order: update.display_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.id)
      );

      const results = await Promise.all(promises);
      const hasError = results.some(result => result.error);

      if (hasError) {
        throw new Error('批量更新排序失败');
      }

      return { 
        success: true, 
        message: '轮播图排序更新成功' 
      };
    } catch (error) {
      console.error('Error updating banner order:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : '批量更新排序失败' 
      };
    }
  }

  // 上传轮播图图片到Storage
  static async uploadBannerImage(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      console.log(`开始上传轮播图: ${file.name}`);
      console.log(`文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      console.log(`文件类型: ${file.type}`);
      
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return { 
          success: false, 
          message: `❌ 文件类型不支持！\n\n当前文件类型: ${file.type}\n支持的图片格式: JPG, JPEG, PNG, GIF, WebP` 
        };
      }

      // 验证文件大小（最大10MB）
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return { 
          success: false, 
          message: `❌ 文件过大！\n\n文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB\n最大限制: 10MB\n\n💡 请压缩文件或选择更小的文件。` 
        };
      }

      // 创建文件路径
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `banner_${timestamp}.${fileExtension}`;
      const filePath = `banners/${fileName}`;

      // 上传文件到 banners 存储桶
      const { error } = await supabase.storage
        .from('banners')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error(`轮播图上传失败，错误详情:`, error);
        
        let errorMessage = '轮播图上传失败';
        
        if (error.message.includes('Bucket not found') || error.message.includes('bucket does not exist')) {
          errorMessage = `❌ 存储桶 "banners" 不存在！\n\n🔧 解决方案：\n1. 打开 Supabase 控制台: https://supabase.com/dashboard\n2. 选择项目 → 进入 Storage 页面\n3. 创建存储桶 "banners"\n4. 设置为公开访问\n\n⏳ 完成后请重新尝试上传。`;
        } else if (error.message.includes('row-level security') || error.message.includes('permission') || error.message.includes('PGRST301')) {
          errorMessage = `❌ 权限不足！\n\n🔧 解决方案：\n1. 确保存储桶设置为公开访问\n2. 检查 RLS 策略是否正确设置\n3. 创建适当的访问策略\n\n💡 这将更新存储桶的访问权限策略。`;
        } else if (error.message.includes('file too large') || error.message.includes('size')) {
          errorMessage = `❌ 文件过大！\n\n当前大小: ${(file.size / 1024 / 1024).toFixed(2)}MB\n限制大小: 10MB\n\n💡 请压缩文件或选择更小的文件。`;
        } else if (error.message.includes('invalid format') || error.message.includes('mime')) {
          errorMessage = `❌ 文件格式不支持！\n\n当前格式: ${file.type}\n支持格式: JPG, JPEG, PNG, GIF, WebP\n\n💡 请转换文件格式后重试。`;
        }
        
        return { 
          success: false, 
          message: errorMessage 
        };
      }

      console.log(`✅ 轮播图上传成功: ${file.name}`);

      // 获取公共URL
      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      console.log(`🔗 获取公共URL成功: ${publicUrl}`);

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('❌ 轮播图上传异常:', error);
      return { 
        success: false, 
        message: `❌ 上传过程中发生未知错误：${error instanceof Error ? error.message : '未知错误'}\n\n🔄 建议：\n1. 检查网络连接\n2. 刷新页面重试\n3. 联系技术支持` 
      };
    }
  }

  // 获取启用的轮播图（用于前端展示）
  static async getActiveBanners(): Promise<{ success: boolean; data?: Banner[]; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
          ? (error as { message: string }).message 
          : String(error);
        throw new Error(errorMessage);
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching active banners:', error);
      return { success: false, message: error instanceof Error ? error.message : '获取启用轮播图失败' };
    }
  }
}

export default BannerService;