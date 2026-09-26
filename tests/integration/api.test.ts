/**
 * Integration Test Suite
 * Tests Authentication, Product Search, Cart Engine, Address Book, and Admin RBAC
 */
import { db } from '../../database';
import { ProductService } from '../../backend/src/services/productService';
import { CartService } from '../../backend/src/services/cartService';

export async function runIntegrationTests() {
  console.log('\n--- Running Integration Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Authentication Tests
  try {
    const validUser = db.authenticate('ujjwal14022003@gmail.com', 'Customer@123');
    assert(validUser !== null && validUser.role === 'customer', 'Auth: Authenticates valid customer');

    const adminUser = db.authenticate('admin@flipkart.com', 'Admin@123');
    assert(adminUser !== null && adminUser.role === 'admin', 'Auth: Authenticates platform administrator');

    const invalidAuth = db.authenticate('ujjwal14022003@gmail.com', 'WrongPassword!');
    assert(invalidAuth === null, 'Auth: Rejects invalid credentials');
  } catch (err: any) {
    assert(false, `Auth suite failed: ${err.message}`);
  }

  // 2. Product Search & Autocomplete Tests
  try {
    const allProducts = ProductService.getAllProducts({});
    assert(allProducts.total > 0, `Catalog: Returns verified products (found ${allProducts.total})`);

    const mobileSearch = ProductService.getAllProducts({ category: 'mobiles' });
    assert(
      mobileSearch.products.every((p) => p.category === 'mobiles'),
      'Catalog: Filters accurately by category "mobiles"'
    );

    const suggestions = db.getSearchSuggestions('sam', 5);
    assert(
      suggestions.some((s) => s.text.toLowerCase().includes('samsung')),
      'Search Suggestions: Autocomplete returns matching brands and products for "sam"'
    );
  } catch (err: any) {
    assert(false, `Product suite failed: ${err.message}`);
  }

  // 3. Cart & Pricing Calculation Tests
  try {
    const testUserId = 'usr-default';
    db.clearCart(testUserId);
    db.addToCart(testUserId, 'prod-iphone15', 1);

    const calculation = CartService.calculateCart(testUserId, '', false);
    assert(calculation.itemCount === 1, 'Cart: Accurately counts added items');
    assert(calculation.platformFee === 3, 'Cart: Enforces standard ₹3 platform fee');
    assert(calculation.finalAmount > 0, `Cart: Computes final payable amount (₹${calculation.finalAmount})`);

    db.clearCart(testUserId);
  } catch (err: any) {
    assert(false, `Cart suite failed: ${err.message}`);
  }

  // 4. Address Book CRUD Tests
  try {
    const testUser = db.registerUser({
      name: 'Address Test User',
      email: `address.test.${Date.now()}@example.com`,
      phone: `998877${Math.floor(1000 + Math.random() * 9000)}`,
      password: 'Password@123'
    });

    const newAddr = db.addAddress(testUser.id, {
      name: 'Test Resident',
      phone: '9988776655',
      pincode: '560103',
      locality: 'Outer Ring Road',
      addressLine: 'Apt 101, Test Tower',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Near Tech Park',
      addressType: 'HOME',
      isDefault: true
    });

    assert(newAddr !== null && newAddr.isDefault === true, 'Address: Successfully adds new default address');

    if (newAddr) {
      const updated = db.updateAddress(testUser.id, newAddr.id, { landmark: 'Opposite Metro Station' });
      assert(updated !== null && updated.landmark === 'Opposite Metro Station', 'Address: Successfully updates address');

      const deleted = db.deleteAddress(testUser.id, newAddr.id);
      assert(deleted === true, 'Address: Successfully deletes address');
    }
  } catch (err: any) {
    assert(false, `Address suite failed: ${err.message}`);
  }

  return { passed, failed };
}
