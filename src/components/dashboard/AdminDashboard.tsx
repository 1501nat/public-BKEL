import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Bell, Users } from 'lucide-react';

interface Stats {
  courses: number;
  assignments: number;
  announcements: number;
  users: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    courses: 0,
    assignments: 0,
    announcements: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const getCount = async (table: string) => {
          const { count } = await supabase
            .from(table)
            .select('id', { count: 'exact', head: true });
          return count || 0;
        };

        const [courses, assignments, announcements, users] = await Promise.all([
          getCount('courses'),
          getCount('assignments'),
          getCount('announcements'),
          getCount('profiles'),
        ]);

        setStats({ courses, assignments, announcements, users });
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: 'Khóa học',
      value: stats.courses,
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      to: '/courses',
    },
    {
      title: 'Bài tập',
      value: stats.assignments,
      icon: <FileText className="h-5 w-5 text-success" />,
      to: '/assignments',
    },
    {
      title: 'Thông báo',
      value: stats.announcements,
      icon: <Bell className="h-5 w-5 text-warning" />,
      to: '/announcements',
    },
    {
      title: 'Người dùng',
      value: stats.users,
      icon: <Users className="h-5 w-5 text-destructive" />,
      to: '/users',
    },
  ];

  return (
    <div className="container py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Bảng điều khiển Admin</h1>
        <p className="text-muted-foreground">Quản lý toàn bộ hệ thống</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Link to={card.to}>
              <Card className="shadow-card hover:shadow-hover transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? '...' : card.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
