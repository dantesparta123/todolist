'use client';

import { useState, useRef } from 'react';
import { Todo } from '@/types/todo';
import { createTodo } from '@/lib/todo';
import { Download, Upload, AlertCircle, CheckCircle, X, FileText } from 'lucide-react';

interface FloatingImportExportProps {
  todos: Todo[];
  onImportSuccess: () => void;
}

export default function FloatingImportExport({ todos, onImportSuccess }: FloatingImportExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 导出为CSV
  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const csvContent = generateCSV(todos);
      downloadCSV(csvContent, 'todos.csv');
    } catch (error) {
      console.error('导出失败:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // 生成CSV内容
  const generateCSV = (todos: Todo[]): string => {
    const headers = ['标题', '描述', '状态', '创建时间', '更新时间'];
    const rows = todos.map(todo => [
      todo.title,
      todo.description,
      todo.completed ? '已完成' : '未完成',
      new Date(todo.created_at).toLocaleString('zh-CN'),
      new Date(todo.updated_at).toLocaleString('zh-CN')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  };

  // 下载CSV文件
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理文件导入
  const handleFileImport = async (file: File) => {
    if (!file) return;

    setIsImporting(true);
    setImportMessage(null);

    try {
      const text = await file.text();
      const todos = parseCSV(text);
      
      // 验证数据
      const validationResult = validateTodos(todos);
      if (!validationResult.isValid) {
        setImportMessage({ type: 'error', text: validationResult.error });
        return;
      }

      // 批量创建任务
      let successCount = 0;
      let errorCount = 0;

      for (const todo of todos) {
        try {
          await createTodo({
            title: todo.title,
            description: todo.description
          });
          successCount++;
        } catch (error) {
          errorCount++;
          console.error('创建任务失败:', error);
        }
      }

      if (successCount > 0) {
        setImportMessage({ 
          type: 'success', 
          text: `成功导入 ${successCount} 个任务${errorCount > 0 ? `，${errorCount} 个失败` : ''}` 
        });
        onImportSuccess();
      } else {
        setImportMessage({ type: 'error', text: '导入失败，请检查文件格式' });
      }
    } catch {
      setImportMessage({ type: 'error', text: '文件读取失败，请检查文件格式' });
    } finally {
      setIsImporting(false);
    }
  };

  // 导入CSV（文件选择）
  const importFromCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileImport(file);
    }
    // 清除文件输入
    event.target.value = '';
  };

  // 拖拽处理函数
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.type === 'text/csv' || 
      file.name.endsWith('.csv') ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );

    if (csvFile) {
      await handleFileImport(csvFile);
    } else {
      setImportMessage({ type: 'error', text: '请拖拽CSV或Excel文件' });
    }
  };

  // 解析CSV
  const parseCSV = (csvText: string): Array<{ title: string; description: string }> => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV文件格式不正确');
    }

    const todos: Array<{ title: string; description: string }> = [];
    
    // 跳过标题行，从第二行开始解析
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const columns = parseCSVLine(line);
      
      if (columns.length >= 2) {
        todos.push({
          title: columns[0].trim(),
          description: columns[1].trim()
        });
      }
    }

    return todos;
  };

  // 解析CSV行
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  // 验证任务数据
  const validateTodos = (todos: Array<{ title: string; description: string }>) => {
    if (todos.length === 0) {
      return { isValid: false, error: 'CSV文件中没有有效的任务数据' };
    }

    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];
      if (!todo.title || todo.title.trim().length === 0) {
        return { isValid: false, error: `第 ${i + 2} 行：任务标题不能为空` };
      }
      if (todo.title.length > 100) {
        return { isValid: false, error: `第 ${i + 2} 行：任务标题不能超过100个字符` };
      }
      if (todo.description && todo.description.length > 500) {
        return { isValid: false, error: `第 ${i + 2} 行：任务描述不能超过500个字符` };
      }
    }

    return { isValid: true, error: '' };
  };

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center z-50"
        title="数据导入导出"
      >
        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* 模态框 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">数据导入导出</h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setImportMessage(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 模态框内容 */}
            <div className="p-4 space-y-4">
              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={exportToCSV}
                  disabled={isExporting || todos.length === 0}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? '导出中...' : '导出CSV'}
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  <Upload className="w-4 h-4" />
                  {isImporting ? '导入中...' : '选择文件'}
                </button>
              </div>

              {/* 拖拽区域 */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all duration-200 ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-gray-400" />
                <p className="text-gray-600 mb-2 text-sm sm:text-base">
                  {isDragOver ? '释放文件以上传' : '拖拽CSV或Excel文件到此处'}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  或者点击上方&quot;选择文件&quot;按钮
                </p>
              </div>

              {/* 隐藏的文件输入 */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={importFromCSV}
                className="hidden"
                disabled={isImporting}
              />

              {/* 导入消息 */}
              {importMessage && (
                <div className={`flex items-center gap-2 p-3 rounded-md ${
                  importMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {importMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">{importMessage.text}</span>
                </div>
              )}

              {/* 说明文字 */}
              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                <p>• 支持拖拽或点击选择CSV/Excel文件导入任务</p>
                <p>• 导出包含所有任务信息的CSV文件</p>
                <p>• 文件格式验证和错误提示</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
