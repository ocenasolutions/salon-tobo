// lib/google-sheets.ts
import { GoogleAuth } from 'google-auth-library';
import { sheets_v4, google } from 'googleapis';

interface BillData {
  clientName: string;
  customerMobile?: string;
  attendantBy: string;
  totalAmount: number;
  services: string[];
  paymentMethod: string;
  createdAt: Date;
}

export class GoogleSheetsService {
  private static sheets: sheets_v4.Sheets;
  private static SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

  private static async getSheets() {
    if (!this.sheets) {
      const auth = new GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
        credentials: process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS 
          ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS)
          : undefined,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
    }
    return this.sheets;
  }

  static async addBillToSheet(billData: BillData): Promise<void> {
    try {
      if (!this.SPREADSHEET_ID) {
        console.error('Google Sheets ID not configured');
        return;
      }

      const sheets = await this.getSheets();
      
      // Format the data for the sheet
      const row = [
        new Date().toLocaleDateString('en-IN'), // 
        new Date().toLocaleTimeString('en-IN'), // Time  
        billData.clientName,
        billData.customerMobile || '',
        billData.attendantBy,
        billData.services.join(', '), // Services as comma-separated string
        billData.paymentMethod,
        billData.totalAmount,
        'HUSN Beauty Salon',
        `Bill-${Date.now()}` 
      ];

      const request: sheets_v4.Params$Resource$Spreadsheets$Values$Append = {
        spreadsheetId: this.SPREADSHEET_ID,
        range: 'Sheet1!A:J',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row],
        },
      };

      const response = await sheets.spreadsheets.values.append(request);
      console.log('Successfully added bill to Google Sheets:', response.data);

    } catch (error) {
      console.error('Error adding bill to Google Sheets:', error);
      // Don't throw error to avoid breaking bill creation
    }
  }

  // Initialize sheet with headers (call this once)
  static async initializeSheet(): Promise<void> {
    try {
      const sheets = await this.getSheets();
      
      const headers = [
        'Date',
        'Time', 
        'Client Name',
        'Mobile Number',
        'Attended By',
        'Services',
        'Payment Method',
        'Total Amount',
        'Salon Name',
        'Bill Reference'
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: this.SPREADSHEET_ID,
        range: 'Sheet1!A1:J1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
      });

      console.log('Google Sheets initialized with headers');
    } catch (error) {
      console.error('Error initializing Google Sheets:', error);
    }
  }
}