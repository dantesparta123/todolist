import { ClipboardList } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">暂无任务</h3>
      <p className="text-gray-500 mb-4">开始添加您的第一个任务吧！</p>
      <div className="w-24 h-1 bg-gray-200 rounded-full mx-auto"></div>
    </div>
  );
}
