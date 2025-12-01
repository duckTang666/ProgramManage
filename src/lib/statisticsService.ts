import { supabase } from './supabase';
import { getCurrentUser } from './userUtils';

export interface StatisticsData {
  publicationByType: {
    labels: string[];
    data: number[];
  };
  scoreTrend: {
    labels: string[];
    scores: number[];
  };
  studentPublications: {
    excellent: number[];
    good: number[];
    average: number[];
    pass: number[];
    labels: string[];
  };
}

export class StatisticsService {
  // 获取学生统计数据
  static async getStudentStatistics(): Promise<StatisticsData> {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('用户未登录');
      }

      // 模拟数据 - 在实际项目中应该从数据库获取
      const mockData: StatisticsData = {
        publicationByType: {
          labels: ['项目报告', '论文', '软件作品', '实验报告', '其他'],
          data: [8, 5, 12, 7, 3]
        },
        scoreTrend: {
          labels: ['第1次', '第2次', '第3次', '第4次', '第5次', '第6次', '第7次'],
          scores: [78, 82, 85, 88, 92, 89, 95]
        },
        studentPublications: {
          excellent: [],
          good: [],
          average: [],
          pass: [],
          labels: []
        }
      };

      return mockData;
    } catch (error) {
      console.error('获取学生统计数据失败:', error);
      // 返回默认数据
      return {
        publicationByType: {
          labels: ['项目报告', '论文', '软件作品', '实验报告', '其他'],
          data: [0, 0, 0, 0, 0]
        },
        scoreTrend: {
          labels: ['第1次', '第2次', '第3次'],
          scores: [0, 0, 0]
        },
        studentPublications: {
          excellent: [],
          good: [],
          average: [],
          pass: [],
          labels: []
        }
      };
    }
  }

  // 获取教师统计数据
  static async getTeacherStatistics(): Promise<StatisticsData> {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('用户未登录');
      }

      // 模拟数据 - 在实际项目中应该从数据库获取
      const mockData: StatisticsData = {
        publicationByType: {
          labels: ['项目报告', '论文', '软件作品', '实验报告', '其他'],
          data: [35, 25, 20, 15, 5]
        },
        scoreTrend: {
          labels: [],
          scores: []
        },
        studentPublications: {
          excellent: [8, 5, 3, 1, 1],
          good: [10, 7, 3, 2, 0],
          average: [2, 1, 0, 0, 0],
          pass: [1, 1, 0, 0, 0],
          labels: ['项目报告', '论文', '软件作品', '实验报告', '其他']
        }
      };

      return mockData;
    } catch (error) {
      console.error('获取教师统计数据失败:', error);
      // 返回默认数据
      return {
        publicationByType: {
          labels: ['项目报告', '论文', '软件作品', '实验报告', '其他'],
          data: [0, 0, 0, 0, 0]
        },
        scoreTrend: {
          labels: [],
          scores: []
        },
        studentPublications: {
          excellent: [0, 0, 0, 0, 0],
          good: [0, 0, 0, 0, 0],
          average: [0, 0, 0, 0, 0],
          pass: [0, 0, 0, 0, 0],
          labels: ['项目报告', '论文', '软件作品', '实验报告', '其他']
        }
      };
    }
  }

  // 获取实际数据库中的学生发布统计
  static async getStudentPublicationStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('achievement_types(name)')
        .eq('publisher_id', userId);

      if (error) throw error;

      // 统计各类型的数量
      const typeCount: { [key: string]: number } = {};
      data?.forEach(achievement => {
        const typeName = achievement.achievement_types?.name || '未分类';
        typeCount[typeName] = (typeCount[typeName] || 0) + 1;
      });

      return typeCount;
    } catch (error) {
      console.error('获取学生发布统计失败:', error);
      return {};
    }
  }

  // 获取学生的成绩趋势
  static async getStudentScoreTrend(userId: string) {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('score, created_at')
        .eq('publisher_id', userId)
        .not('score', 'is', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data?.map(item => ({
        score: item.score,
        date: item.created_at
      })) || [];
    } catch (error) {
      console.error('获取学生成绩趋势失败:', error);
      return [];
    }
  }

  // 获取教师指导学生的发布统计
  static async getTeacherStudentStats(teacherId: string) {
    try {
      // 首先获取该教师指导的学生
      const { data: students, error: studentsError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 1); // 学生

      if (studentsError) throw studentsError;

      if (!students || students.length === 0) {
        return { excellent: [], good: [], average: [], pass: [], labels: [] };
      }

      const studentIds = students.map(s => s.id);

      // 获取这些学生的成果
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('score, achievement_types(name)')
        .in('publisher_id', studentIds)
        .not('score', 'is', null);

      if (achievementsError) throw achievementsError;

      // 按类型和分数段统计
      const stats: { [type: string]: { excellent: number; good: number; average: number; pass: number } } = {};
      
      achievements?.forEach(achievement => {
        const typeName = achievement.achievement_types?.name || '未分类';
        if (!stats[typeName]) {
          stats[typeName] = { excellent: 0, good: 0, average: 0, pass: 0 };
        }

        const score = achievement.score || 0;
        if (score >= 90) stats[typeName].excellent++;
        else if (score >= 80) stats[typeName].good++;
        else if (score >= 70) stats[typeName].average++;
        else if (score >= 60) stats[typeName].pass++;
      });

      const labels = Object.keys(stats);
      return {
        excellent: labels.map(label => stats[label]?.excellent || 0),
        good: labels.map(label => stats[label]?.good || 0),
        average: labels.map(label => stats[label]?.average || 0),
        pass: labels.map(label => stats[label]?.pass || 0),
        labels
      };
    } catch (error) {
      console.error('获取教师学生统计失败:', error);
      return { excellent: [], good: [], average: [], pass: [], labels: [] };
    }
  }
}

export default StatisticsService;