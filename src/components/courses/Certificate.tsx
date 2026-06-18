'use client';

import { Award, Download } from 'lucide-react';

interface Props {
  courseName: string;
  studentName: string;
  completionDate: string;
  certificateNumber: string;
}

export default function Certificate({ courseName, studentName, completionDate, certificateNumber }: Props) {
  return (
    <div className="rounded-xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 text-center dark:from-yellow-900/20 dark:to-orange-900/20">
      <Award className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Certificate of Completion</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">This certifies that</p>
      <p className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{studentName}</p>
      <p className="mb-4 text-gray-600 dark:text-gray-400">has successfully completed</p>
      <p className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400">{courseName}</p>
      <p className="mb-4 text-sm text-gray-500">Completed on: {completionDate}</p>
      <p className="text-xs text-gray-400">Certificate ID: {certificateNumber}</p>
      <button className="mt-6 inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        <Download className="h-4 w-4" />
        Download Certificate
      </button>
    </div>
  );
}
