import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export const exportToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToPDF = (data: any[], filename: string) => {
  // Simple HTML to PDF conversion using browser print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head><title>${filename}</title></head>
        <body>
          <h1>Attendance Report</h1>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};