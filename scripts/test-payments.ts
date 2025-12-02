/**
 * Manual Test Script for Payment System
 * Run this to manually test the payment validation functions
 */

import {
  validateEmail,
  validatePhone,
  validatePaymentReference,
  validateAmount,
  sanitizeString,
  sanitizePhone,
  formatCurrency,
  formatPhoneNumber,
  generateWhatsAppURL,
} from '../lib/payments';

console.log('🧪 Testing Payment System\n');

// Test 1: Email Validation
console.log('📧 Email Validation:');
console.log('  Valid email (test@example.com):', validateEmail('test@example.com'));
console.log('  Invalid email (invalid):', validateEmail('invalid'));

// Test 2: Phone Validation
console.log('\n📱 Phone Validation:');
console.log('  Valid phone (3001234567):', validatePhone('3001234567'));
console.log('  Invalid phone (123):', validatePhone('123'));

// Test 3: Sanitization
console.log('\n🧹 String Sanitization:');
console.log('  Input: "<script>alert(\'xss\')</script>"');
console.log('  Output:', sanitizeString('<script>alert(\'xss\')</script>'));

console.log('\n📞 Phone Sanitization:');
console.log('  Input: "(300) 123-4567"');
console.log('  Output:', sanitizePhone('(300) 123-4567'));

// Test 4: Formatting
console.log('\n💰 Currency Formatting:');
console.log('  50000 COP:', formatCurrency(50000));
console.log('  1000000 COP:', formatCurrency(1000000));

console.log('\n📱 Phone Formatting:');
console.log('  3001234567:', formatPhoneNumber('3001234567'));

// Test 5: WhatsApp URL Generation
console.log('\n💬 WhatsApp URL:');
const url = generateWhatsAppURL('ORD123', 50000, '573001234567');
console.log('  URL:', url);

// Test 6: Payment Reference Validation
console.log('\n🔖 Payment Reference Validation:');
console.log('  Valid reference (ABC123):', validatePaymentReference('ABC123'));
console.log('  Invalid reference (12):', validatePaymentReference('12'));

// Test 7: Amount Validation
console.log('\n💵 Amount Validation:');
console.log('  Valid amount (50000):', validateAmount(50000));
console.log('  Invalid amount (500):', validateAmount(500));

console.log('\n✅ All manual tests completed!');
