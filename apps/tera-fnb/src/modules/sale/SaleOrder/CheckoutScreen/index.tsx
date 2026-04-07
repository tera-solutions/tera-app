import colors from '@tera/commons/constants/colors';
import { formatNumber } from '@tera/commons/utils';
import CalculatorDialog from '@components/shared/CalculatorDialog';
import { TextInput } from '@components/ui';
import SelectProductDialog from '@modules/logistic/Product/SelectProductDialog';
import ShippingFeeDialog from '@modules/logistic/ShippingFeeDialog';
import PaymentProcessDialog from '@modules/sale/SaleOrder/PaymentProcessDialog';
import PrepaymentDialog from '@modules/sale/SaleOrder/PrepaymentDialog';
import SelectCustomerDialog from '@modules/sale/SaleOrder/SelectCustomerDialog';
import CustomerItem, {
  Customer,
} from '@modules/sale/SaleOrder/SelectCustomerDialog/CustomerItem';
import SelectDeliveryTimeDialog from '@modules/sale/SaleOrder/SelectDeliveryTimeDialog';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartItemRow, { CartItem } from './CartItemRow';
import { styles } from './styles';

interface Calculations {
  discountValue: number;
  shippingFee: number;
  surcharges: number; // 2 loại phụ thu
  vatRate: number; // 10% VAT
  cleaningFeeRate: number; // 5% Vệ sinh
}

const DUMMY_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Xì dầu',
    unit: 'Cái',
    price: 18000,
    quantity: 1,
    image: 'https://cdnv2.tgdd.vn/pim/cdn/images/202512/NUOC%20GIAT154159.jpg',
  },
  {
    id: '2',
    name: 'Bánh mứt',
    unit: 'Cái',
    price: 39000,
    quantity: 1,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/14/bannerbrandpromo/sis280x440_202506010909536791.jpg',
  },
];

const INITIAL_CALCS: Calculations = {
  discountValue: 0,
  shippingFee: 0,
  surcharges: 8550, // Giá trị cố định như trong hình a16.jpg
  vatRate: 0.1, // 10%
  cleaningFeeRate: 0.05, // 5%
};

interface CalculationRowProps {
  label: string;
  value: number;
  showIcon?: boolean;
  isNegative?: boolean;
  badgeText?: string;
  isTotal?: boolean;
  onPress?: () => void;
}

const CalculationRow: React.FC<CalculationRowProps> = ({
  label,
  value,
  showIcon = true,
  isNegative = false,
  badgeText,
  isTotal = false,
  onPress,
}) => (
  <TouchableOpacity style={styles.calcRow} onPress={onPress}>
    <View style={styles.calcLabelGroup}>
      {showIcon && (
        <Icon source="close-circle-outline" size={16} color="#9CA3AF" />
      )}
      <Text style={styles.calcLabelText}>{label}</Text>
      {badgeText && <Text style={styles.calcBadge}>{badgeText}</Text>}
    </View>
    <View style={styles.calcValueGroup}>
      <Text
        style={[
          styles.calcValueText,
          isTotal && styles.totalAmountText,
          isNegative && styles.negativeValue,
        ]}
      >
        {formatNumber(isNegative ? -value : value)}
      </Text>
      {!isTotal && <Icon source="pencil-outline" size={16} color="#9CA3AF" />}
    </View>
  </TouchableOpacity>
);

const CheckoutScreen: React.FC = () => {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>(DUMMY_ITEMS);
  const [calcs, setCalcs] = useState<Calculations>(INITIAL_CALCS);
  const [isCustomerModalVisible, setCustomerModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>();
  const [isProductModalVisible, setProductModalVisible] = useState(false);
  const [isTimeModalVisible, setTimeModalVisible] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);
  const [isPrepaymentModalVisible, setPrepaymentModalVisible] = useState(false);
  const [prepaidAmount, setPrepaidAmount] = useState(0); // Số tiền đã thanh toán trước
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isDiscountModalVisible, setDiscountModalVisible] = useState(false);
  const [isShippingModalVisible, setShippingModalVisible] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);

  // --- Logic Tính toán ---
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const baseAmount =
    subtotal - calcs.discountValue + calcs.shippingFee + calcs.surcharges;

  const vatAmount = baseAmount * calcs.vatRate;
  const cleaningFeeAmount = baseAmount * calcs.cleaningFeeRate;

  const finalTotal = baseAmount + vatAmount + cleaningFeeAmount; // Tổng cộng cuối cùng

  const remainingToPay = finalTotal - prepaidAmount; // Số tiền còn lại phải thanh toán

  // Hàm xử lý khi xác nhận thanh toán trước từ Dialog
  const handleConfirmPrepayment = (paidAmount: number, method: string) => {
    setPrepaidAmount(paidAmount);
    setPaymentMethod(method);
    console.tron(
      `Đã thanh toán trước: ${formatNumber(paidAmount)} bằng ${method}`,
    );
  };
  // --- Handlers ---
  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      ),
    );
  };

  const handleConfirmDeliveryTime = (date: Date, reminderMinutes: number) => {
    setDeliveryTime(date);
    console.tron(
      `Đã hẹn giao vào: ${date.toLocaleString()} với nhắc nhở trước ${reminderMinutes} phút.`,
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleApplyDiscount = (value: number, type: 'VNĐ' | '%') => {
    let discount = value;
    if (type === '%') {
      discount = (value / 100) * subtotal;
    }

    setCalcs((prev) => ({
      ...prev,
      discountValue: discount,
    }));
    console.tron(`Đã áp dụng chiết khấu: ${value} ${type}`);
  };

  // Hàm xử lý khi xác nhận phí vận chuyển
  const handleConfirmShippingFee = (fee: number, carrier?: string) => {
    setCalcs((prev) => ({
      ...prev,
      shippingFee: fee, // Cập nhật phí vận chuyển
    }));
  };

  // --- Logic Thêm sản phẩm ---
  const handleAddSelectedProducts = (newProducts: CartItem[]) => {
    setCart((prevCart) => {
      let updatedCart = [...prevCart];

      newProducts.forEach((newP) => {
        const existingItemIndex = updatedCart.findIndex(
          (item) => item.id === newP.id,
        );

        if (existingItemIndex !== -1) {
          // Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
          updatedCart[existingItemIndex].quantity += 1;
          updatedCart[existingItemIndex].subtotal =
            updatedCart[existingItemIndex].quantity *
            updatedCart[existingItemIndex].price;
        } else {
          // Thêm sản phẩm mới (giả định số lượng ban đầu là 1)
          updatedCart.push({ ...newP, quantity: 1, subtotal: newP.price });
        }
      });
      return updatedCart;
    });
  };

  // Hàm xử lý khi hoàn tất thanh toán (sau khi đóng PaymentProcessDialog)
  const handleCompletePayment = (
    paidAmount: number,
    method: string,
    isDebt: boolean,
  ) => {
    console.tron(
      `Hoàn tất thanh toán. Tổng thu: ${formatNumber(paidAmount)}. Phương thức: ${method}. Ghi nợ: ${isDebt}`,
    );
    // Chuyển sang màn hình "Đơn hàng đã tạo" hoặc reset màn hình
    router.push({
      pathname: '/sale/bill-detail',
      params: { id: 1 },
    });
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.leftHeader}
            onPress={() => router.back()}
          >
            <Icon source="arrow-left" size={24} color={colors.gray} />
            <Text style={styles.titleText}>Đơn bán hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rightHeader}
            onPress={() => console.tron('Mang về')}
          >
            <Icon
              source="truck-fast-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.iconText, { color: colors.primary }]}>
              Giao hàng
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* THÊM SẢN PHẨM */}
          <TouchableOpacity
            style={styles.addProductContainer}
            onPress={() => setProductModalVisible(true)}
          >
            <Icon source="plus" size={18} color="#3B82F6" />
            <Text style={styles.addProductText}>Thêm sản phẩm</Text>
          </TouchableOpacity>

          {/* DANH SÁCH SẢN PHẨM */}
          <View style={styles.cartListContainer}>
            {cart.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </View>

          {/* CHỌN KHÁCH HÀNG */}
          {selectedCustomer ? (
            <View style={styles.customerSelectRow}>
              <CustomerItem
                isSelected={true}
                customer={selectedCustomer}
                onPress={() => setCustomerModalVisible(true)}
                onSelect={setSelectedCustomer}
              />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.customerSelectRow}
              onPress={() => setCustomerModalVisible(true)}
            >
              <Icon source="account-circle-outline" size={20} color="#4B5563" />
              <Text style={styles.customerSelectText}>Chọn khách hàng</Text>
              <Icon source="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}

          {/* TÍNH TOÁN CHI TIẾT */}
          <View style={styles.calculationSection}>
            <CalculationRow
              label={`Tổng ${totalItems} SP`}
              value={subtotal}
              showIcon={false}
            />

            <CalculationRow
              label="Giảm giá"
              value={calcs.discountValue}
              showIcon={false}
              onPress={() => setDiscountModalVisible(true)}
            />
            <CalculationRow
              label="Vận chuyển"
              value={calcs.shippingFee}
              onPress={() => setShippingModalVisible(true)}
            />
            <CalculationRow
              label="Phụ thu"
              value={calcs.surcharges}
              badgeText={'2'}
            />
            {/* Các loại thuế phí con */}
            <View style={styles.subCalcRow}>
              <CalculationRow label="Vat (10%)" value={vatAmount} />
              <CalculationRow label="Vat (5%)" value={cleaningFeeAmount} />
            </View>
            <CalculationRow
              label="Tổng cộng"
              value={finalTotal}
              isTotal={true}
            />

            <TouchableOpacity
              style={styles.prepaymentRow}
              onPress={() => setPrepaymentModalVisible(true)}
            >
              <Icon
                source={
                  prepaidAmount > 0 ? 'cash-check' : 'calendar-month-outline'
                } // Icon thay đổi nếu đã trả tiền
                size={18}
                color={prepaidAmount > 0 ? '#10B981' : '#3B82F6'}
              />
              <Text
                style={[
                  styles.prepaymentText,
                  prepaidAmount > 0 && styles.prepaymentTextPaid,
                ]}
              >
                {prepaidAmount > 0
                  ? `Đã trả: ${formatNumber(prepaidAmount)} (${paymentMethod})`
                  : `Thanh toán trước`}
              </Text>
              {prepaidAmount > 0 && (
                <Icon source="pencil-outline" size={18} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Ghi chú đơn hàng */}
          <View style={styles.noteSection}>
            <TextInput
              style={styles.noteInput}
              placeholder="Ghi chú đơn hàng"
              multiline
            />
            <TouchableOpacity style={styles.imageButton}>
              <Icon source="image-outline" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.timeScheduleRow}
            onPress={() => setTimeModalVisible(true)}
          >
            <Icon source="clock-time-three-outline" size={20} color="#4B5563" />
            <Text style={styles.scheduleText}>Hẹn giờ giao</Text>
            <Icon source="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.dateRow}>
            <View style={styles.dateInfo}>
              <Icon source="calendar-month-outline" size={20} color="#4B5563" />
              <Text style={styles.dateLabel}>Ngày tạo</Text>
            </View>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => console.tron('Chọn ngày')}
            >
              <Text style={styles.dateValue}>07/12/2025</Text>
              <Icon source="calendar-month-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.addInfoSection}>
            <Icon source="cog-outline" size={20} color="#4B5563" />
            <View style={styles.addInfoContent}>
              <Text style={styles.addInfoTitle}>Thêm thông tin</Text>
              <Text style={styles.addInfoText}>
                Bạn đã thêm tất cả thông tin khác của sản phẩm
              </Text>
            </View>
          </View>
        </ScrollView>
        {/* FOOTER ACTIONS */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={() => console.tron('Lưu đơn')}
          >
            <Text style={styles.saveButtonText}>Lưu đơn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.printButton]}
            onPress={() => router.push('BillDetail')}
          >
            <Text style={styles.checkoutButtonText}>In tạm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.checkoutButton]}
            onPress={() => setPaymentModalVisible(true)}
          >
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
        <PaymentProcessDialog
          isVisible={isPaymentModalVisible}
          onClose={() => setPaymentModalVisible(false)}
          amountToPay={remainingToPay} // Truyền số tiền còn lại cần thu
          onCompletePayment={handleCompletePayment}
        />
        <SelectCustomerDialog
          isVisible={isCustomerModalVisible}
          onClose={() => setCustomerModalVisible(false)}
          onSelectCustomer={setSelectedCustomer}
          onAddNewCustomer={() =>
            console.tron('Chuyển sang màn hình tạo mới khách hàng')
          }
        />
        <SelectProductDialog
          isVisible={isProductModalVisible}
          onClose={() => setProductModalVisible(false)}
          onSelectProducts={(products: any) => {
            handleAddSelectedProducts(products);
            setProductModalVisible(false);
          }}
        />
        <SelectDeliveryTimeDialog
          isVisible={isTimeModalVisible}
          onClose={() => setTimeModalVisible(false)}
          onConfirm={handleConfirmDeliveryTime}
        />
        <PrepaymentDialog
          isVisible={isPrepaymentModalVisible}
          onClose={() => setPrepaymentModalVisible(false)}
          totalAmount={finalTotal}
          onConfirmPayment={handleConfirmPrepayment}
        />
        <CalculatorDialog
          title="Chiết khấu"
          visible={isDiscountModalVisible}
          onClose={() => setDiscountModalVisible(false)}
          onConfirm={handleApplyDiscount}
        />
        <ShippingFeeDialog
          isVisible={isShippingModalVisible}
          onClose={() => setShippingModalVisible(false)}
          onConfirm={handleConfirmShippingFee}
        />
      </SafeAreaView>
    </View>
  );
};
export default CheckoutScreen;
