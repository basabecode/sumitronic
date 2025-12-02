/**
 * Payment Types and Interfaces for Digital Wallets
 * Security: All sensitive data should be handled server-side
 */

export type PaymentMethod = 'DIGITAL_WALLET' | 'CREDIT_CARD' | 'PSE';

export type PaymentStatus =
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'PAID'
  | 'PROCESSING'
  | 'CANCELLED'
  | 'FAILED';

export type DigitalWalletProvider =
  | 'NEQUI'
  | 'DAVIPLATA'
  | 'BANCOLOMBIA'
  | 'DAVIVIENDA'
  | 'NUBANK';

/**
 * Digital Wallet Account Information
 * Note: This is public information displayed to customers
 */
export interface DigitalWalletAccount {
  provider: DigitalWalletProvider;
  accountNumber: string;
  accountType?: 'SAVINGS' | 'CHECKING' | 'WALLET';
  accountHolder: string;
  displayName: string;
  icon?: string;
  qrCode?: string; // Optional QR code for easier payments
  instructions?: string;
}

/**
 * Payment Reference submitted by customer
 * Security: Sanitize all user inputs
 */
export interface PaymentReference {
  referenceNumber?: string; // Transaction ID or approval code
  senderPhone?: string; // Phone number used for payment
  paymentDate?: Date;
  paymentTime?: string;
  amount: number; // For verification purposes
  selectedProvider: DigitalWalletProvider;
  screenshot?: File; // Optional payment screenshot
}

/**
 * Order Payment Information
 * This extends the order with payment-specific data
 */
export interface OrderPaymentInfo {
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: PaymentReference;
  totalAmount: number;
  createdAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string; // Admin user who verified
  notes?: string; // Admin notes about verification
}

/**
 * Payment Verification Request (Admin)
 */
export interface PaymentVerificationRequest {
  orderId: string;
  status: PaymentStatus;
  verifiedBy: string;
  notes?: string;
  actualAmount?: number; // Amount actually received
}

/**
 * Checkout Form Data with Payment Info
 */
export interface CheckoutFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Shipping Address
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;

  // Payment Information
  paymentMethod: PaymentMethod;
  paymentReference?: PaymentReference;

  // Options
  saveInfo?: boolean;
  acceptTerms: boolean;
  newsletter?: boolean;
}

/**
 * Validation Errors
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Payment Configuration
 */
export interface PaymentConfig {
  enabledMethods: PaymentMethod[];
  digitalWalletAccounts: DigitalWalletAccount[];
  whatsappNumber: string;
  requirePaymentReference: boolean;
  allowScreenshotUpload: boolean;
}
