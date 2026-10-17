'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import StatsCard from '@/components/StatsCard';

type VisitorCount = {
  uniqueVisitors: number | null;
  configured: boolean;
  available?: boolean;
};

export default function UniqueVisitorsCard() {
  const [visitorCount, setVisitorCount] = useState<VisitorCount | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/visitors', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as VisitorCount;
        setVisitorCount(result);
      })
      .catch(() => {
        if (!controller.signal.aborted) setVisitorCount({ uniqueVisitors: null, configured: true, available: false });
      });

    return () => controller.abort();
  }, []);

  const value = visitorCount?.uniqueVisitors;
  const label = !visitorCount
    ? 'Đang tải'
    : !visitorCount.configured
      ? 'Chưa cấu hình'
      : !visitorCount.available
        ? 'Tạm gián đoạn'
        : new Intl.NumberFormat('vi-VN').format(value ?? 0);
  const subtitle = visitorCount?.available
    ? 'Trình duyệt duy nhất'
    : 'Cần kết nối kho đếm';

  return (
    <StatsCard
      label="Người truy cập"
      value={label}
      icon={<Users size={18} />}
      color="#06B6D4"
      subtitle={subtitle}
    />
  );
}
