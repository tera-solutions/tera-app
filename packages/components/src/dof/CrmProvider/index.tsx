import { createContext, useContext, useState } from "react";
// import { useStores } from './useStores';

export type MemberType =
  | "customer"
  | "supplier"
  | "customer_lead"
  | "supplier_lead";

export type MemberDisplayMode = "default" | "delete";

export type EmployeeMode = "default" | "disable" | "delete";
export type followerMode = "default" | "soft";
export interface IFollowerValue {
  open: boolean;
  mode?: followerMode;
  objectType: string;
  objectId: string;
}
interface IValue {
  selectContact: any;
  selectEmployee: any;
  selectCustomer: any;
  selectedLead: any;
  selectedCustomerLead: any;
  selectSupplier: any;
  selectedSupplierLead: any;
  selectedMember: any;
  exceptedMember: any;
  selectedFollower: any;
  selectActivityTask: any;
  selectActivityAppointment: any;
  selectActivityCall: any;
  selectConsultingTicket: any;
  listProductSelect: any[];
  typeModalContact: string;
  memberType: string;
  openModalSelectContact: boolean;
  openModalSelectProduct: boolean;
  openModalCustomer: boolean;
  openModalLead: boolean;
  openModalCustomerLead: boolean;
  openModalSupplier: boolean;
  openModalSupplierLead: boolean;
  openModalContact: boolean;
  openModalEmployee: {
    open: boolean;
    mode?: EmployeeMode;
  };
  openModalActivityTask: boolean;
  openModalActivityAppointment: boolean;
  openModalActivityCall: boolean;
  openModalConsultingTicket: boolean;
  openModalMember: {
    open: boolean;
    type?: MemberType;
    displayMode: MemberDisplayMode;
  };
  openModalFollower: IFollowerValue;
  listId: number[];
  typeOrder: string;
  title: string;
  setIds: (arrId: number[]) => void;
  handleChangeTypeOrder: (type: string) => void;
  handleSelectItemContact: (itemSelect: any) => void;
  handleSelectItemCustomer: (itemSelect: any) => void;
  handleSelectItemLead: (itemSelect: any) => void;
  handleSelectItemCustomerLead: (itemSelect: any) => void;
  handleSelectItemSupplier: (itemSelect: any) => void;
  handleSelectItemSupplierLead: (itemSelect: any) => void;
  handleSelectItemEmployee: (itemSelect: any) => void;
  handleRemoveItemEmployee: (itemSelect: any) => void;
  handleSelectActivityTask: (itemSelect: any) => void;
  handleSelectActivityAppointment: (itemSelect: any) => void;
  handleSelectActivityCall: (itemSelect: any) => void;
  handleSelectConsultingTicket: (itemSelect: any) => void;
  handleSelectItemMember: (itemSelect: any) => void;
  handleSelectItemFollower: (itemSelect: any) => void;
  handleRemoveItemActivity: (itemSelect: any) => void;
  handleRemoveItemMember: (itemSelect: any) => void;
  handleAddListProduct: (ListProduct: any[]) => void;
  handleDeleteProduct: (idProduct: string | number) => void;
  handleOpenModalContactOrder: (
    type: "customer" | "supplier" | "product",
  ) => void;
  handleOpenModalProduct: (typeOrder?: string) => void;
  handleOpenModalCustomer: (titleText: string) => void;
  handleOpenModalLead: (titleText: string) => void;
  handleOpenModalCustomerLead: (titleText: string) => void;
  handleOpenModalSupplier: (titleText: string) => void;
  handleOpenModalSupplierLead: (titleText: string) => void;
  handleOpenModalContact: (titleText: string) => void;
  handleOpenModalEmployee: (titleText: string, mode?: EmployeeMode) => void;
  handleOpenModalActivityTask: () => void;
  handleOpenModalActivityAppointment: () => void;
  handleOpenModalActivityCall: () => void;
  handleOpenModalConsultingTicket: () => void;
  handleOpenModalMember: (
    type: MemberType,
    displayMode: MemberDisplayMode,
  ) => void;
  handleOpenModalFollower: ({ title, mode, objectType, objectId }) => void;

  closeModalContactOrder: () => void;
  closeModalContact: () => void;
  closeModalProduct: () => void;
  closeModalCustomer: () => void;
  closeModalLead: () => void;
  closeModalCustomerLead: () => void;
  closeModalSupplierLead: () => void;
  closeModalSupplier: () => void;
  closeModalActivityTask: () => void;
  closeModalActivityAppointment: () => void;
  closeModalActivityCall: () => void;
  closeModalConsultingTicket: () => void;
  closeModalEmployee: () => void;
  closeModalMember: () => void;
  closeModalFollower: () => void;
  clearStore: () => void;
  clearActivityStore: () => void;
  updateMemberType: (type: MemberType) => void;
  handleAddExceptIdMember: (value: any) => void;
}

export const CrmContext = createContext<IValue | null>(null);

export default function CrmProvider({ children }) {
  // --- isOpen ---
  const [openModalSelectContact, setOpenModalSelectContact] =
    useState<boolean>(false);
  const [openModalSelectProduct, setOpenModalSelectProduct] =
    useState<boolean>(false);
  const [openModalCustomer, setOpenModalCustomer] = useState<boolean>(false);
  const [openModalLead, setOpenModalLead] = useState<boolean>(false);
  const [openModalCustomerLead, setOpenModalCustomerLead] =
    useState<boolean>(false);

  const [openModalSupplier, setOpenModalSupplier] = useState<boolean>(false);
  const [openModalSupplierLead, setOpenModalSupplierLead] =
    useState<boolean>(false);

  const [openModalContact, setOpenModalContact] = useState<boolean>(false);

  const [openModalEmployee, setOpenModalEmployee] = useState<{
    open: boolean;
    mode?: EmployeeMode;
  }>({ open: false, mode: "default" });

  const [openModalActivityTask, setOpenModalActivityTask] =
    useState<boolean>(false);
  const [openModalActivityAppointment, setOpenModalActivityAppointment] =
    useState<boolean>(false);
  const [openModalActivityCall, setOpenModalActivityCall] =
    useState<boolean>(false);
  const [openModalConsultingTicket, setOpenModalConsultingTicket] =
    useState<boolean>(false);

  const [openModalMember, setOpenModalMember] = useState<any>({
    open: false,
    mode: "delete",
    type: "customer",
  });
  const [openModalFollower, setOpenModalFollower] = useState<any>({
    open: false,
    mode: "default",
  });

  // --- data ---
  const [typeModalContact, setTypeModalContact] = useState<string>("");
  const [listProductSelect, setListProductSelect] = useState<any[]>([]); // done
  const [listId, setListId] = useState<number[]>([]); // done
  const [typeOrder, setTypeOrder] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  // -select data-
  const [selectContact, setSelectContact] = useState(null);
  const [selectEmployee, setSelectEmployee] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState(null); // done
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedCustomerLead, setSelectedCustomerLead] = useState(null);

  const [selectSupplier, setSelectSupplier] = useState(null);
  const [selectedSupplierLead, setSelectedSupplierLead] = useState(null);
  const [selectActivityTask, setSelectActivityTask] = useState([]);
  const [selectActivityAppointment, setSelectActivityAppointment] = useState(
    [],
  );
  const [selectActivityCall, setSelectActivityCall] = useState([]);
  const [selectConsultingTicket, setSelectConsultingTicket] = useState([]);

  const [selectedMember, setSelectedMember] = useState(null);
  const [exceptedMember, setExceptedMember] = useState(null);

  const [selectedFollower, setSelectedFollower] = useState([]);

  // ---------

  // --- function list ---

  const handleSelectItemContact = (item: any) => {
    setSelectContact(item);
    setOpenModalContact(false);
  };

  const handleSelectItemCustomer = (item: any) => {
    setOpenModalCustomer(false);
    setSelectCustomer(item);
  };
  const handleSelectItemLead = (item: any) => {
    setOpenModalLead(false);
    setSelectedLead(item);
  };

  const handleSelectItemCustomerLead = (item: any) => {
    setOpenModalCustomerLead(false);
    setSelectedCustomerLead(item);
  };

  const handleSelectItemSupplierLead = (item: any) => {
    setOpenModalSupplierLead(false);
    setSelectedSupplierLead(item);
  };

  const handleSelectItemSupplier = (item: any) => {
    setOpenModalSupplier(false);
    setSelectSupplier(item);
  };

  const handleSelectItemEmployee = (item: any) => {
    setOpenModalEmployee({ open: false });
    setSelectEmployee(item);
  };

  const handleSelectItemMember = (item: any) => {
    setSelectedMember(item);
  };

  const handleSelectItemFollower = (item: any) => {
    setSelectedFollower(item);
  };

  const handleSelectActivityTask = (item: any) => {
    setOpenModalActivityTask(false);
    setSelectActivityTask(item);
  };

  const handleSelectActivityAppointment = (item: any) => {
    setOpenModalActivityAppointment(false);
    setSelectActivityAppointment(item);
  };

  const handleSelectActivityCall = (item: any) => {
    setOpenModalActivityCall(false);
    setSelectActivityCall(item);
  };

  const handleSelectConsultingTicket = (item: any) => {
    setOpenModalConsultingTicket(false);
    setSelectConsultingTicket(item);
  };

  const handleRemoveItemEmployee = (item: any) => {
    setSelectEmployee((prev) => {
      return prev.filter((employee) => employee?.id !== item?.id);
    });
  };

  const handleRemoveItemMember = (item: any) => {
    setSelectedMember((prev) => {
      return prev?.filter((member) => {
        if (
          member?.id === item?.id &&
          member.selectedType === item.selectedType
        )
          return false;
        return true;
      });
    });
  };

  const handleRemoveItemActivity = (item: any) => {
    switch (item?.activity_type) {
      case "task":
        setSelectActivityTask((prev) => {
          return prev.filter((task) => task?.idTask !== item?.idTask);
        });
        return;
      case "appointment":
        setSelectActivityAppointment((prev) => {
          return prev.filter(
            (appointment) => appointment?.idAppointment !== item?.idAppointment,
          );
        });
        return;
      case "call":
        setSelectActivityCall((prev) => {
          return prev.filter((call) => call?.idCall !== item?.idCall);
        });
        return;
      default:
        setSelectConsultingTicket((prev) => {
          return prev.filter(
            (call) => call?.idConsultingTicket !== item?.idConsultingTicket,
          );
        });
        return;
    }
  };

  const handleAddListProduct = (ListProduct: any[]) => {
    setListProductSelect(ListProduct);
    setOpenModalSelectProduct(false);
  };

  const handleDeleteProduct = (idProduct: any) => {
    const filterProduct = listId.filter((id) => id !== idProduct);
    setListId(filterProduct);
  };

  const setIds = (arrId: number[]) => {
    setListId(arrId);
  };

  const handleChangeTypeOrder = (type: string) => {
    setTypeOrder(type);
  };

  // --- open modal ---
  const handleOpenModalContactOrder = (type: string) => {
    setOpenModalSelectContact(true);
    setTypeModalContact(type);
  };

  const handleOpenModalProduct = (typeOrderProp: string) => {
    if (typeOrderProp) {
      setTypeOrder(typeOrderProp);
    }
    setOpenModalSelectProduct(true);
  };

  const handleOpenModalCustomer = (titleText: string) => {
    setOpenModalCustomer(true);
    setTitle(titleText);
  };

  const handleOpenModalLead = (titleText: string) => {
    setOpenModalLead(true);
    setTitle(titleText);
  };

  const handleOpenModalCustomerLead = (titleText: string) => {
    setOpenModalCustomerLead(true);
    setTitle(titleText);
  };

  const handleOpenModalSupplier = (titleText: string) => {
    setOpenModalSupplier(true);

    setTitle(titleText);
  };

  const handleOpenModalSupplierLead = (titleText: string) => {
    setOpenModalSupplierLead(true);
    setTitle(titleText);
  };

  const handleOpenModalContact = (titleText: string) => {
    setOpenModalContact(true);
    setTitle(titleText);
  };

  const handleOpenModalEmployee = (titleText: string, mode?: EmployeeMode) => {
    setOpenModalEmployee({ open: true, mode });
    setTitle(titleText);
  };
  const handleOpenModalMember = (
    type: MemberType,
    displayMode: MemberDisplayMode,
  ) => {
    setOpenModalMember({ open: true, type, displayMode });
  };

  const handleOpenModalFollower = ({ title, mode, objectType, objectId }) => {
    setTitle(title);
    setOpenModalFollower({ open: true, mode, objectType, objectId });
  };

  const handleOpenModalActivityTask = () => {
    setOpenModalActivityTask(true);
  };

  const handleOpenModalActivityAppointment = () => {
    setOpenModalActivityAppointment(true);
  };

  const handleOpenModalActivityCall = () => {
    setOpenModalActivityCall(true);
  };

  const handleOpenModalConsultingTicket = () => {
    setOpenModalConsultingTicket(true);
  };

  // --- close modal ---
  const closeModalContactOrder = () => {
    setOpenModalSelectContact(false);
  };

  const closeModalCustomer = () => {
    setOpenModalCustomer(false);
    setTitle("");
  };
  const closeModalLead = () => {
    setOpenModalLead(false);
    setTitle("");
  };
  const closeModalCustomerLead = () => {
    setOpenModalCustomerLead(false);
    setTitle("");
  };

  const closeModalSupplier = () => {
    setOpenModalSupplier(false);
    setTitle("");
  };

  const closeModalSupplierLead = () => {
    setOpenModalSupplierLead(false);
    setTitle("");
  };

  const closeModalContact = () => {
    setOpenModalContact(false);
    setTitle("");
  };

  const closeModalEmployee = () => {
    setOpenModalEmployee({ open: false });
    setTitle("");
  };
  const closeModalFollower = () => {
    setOpenModalFollower({ open: false });
    setTitle("");
  };

  const closeModalMember = () => {
    setOpenModalMember((prev) => ({ ...prev, open: false }));
  };

  const closeModalProduct = () => {
    setOpenModalSelectProduct(false);
    setTypeOrder("");
  };

  const closeModalActivityTask = () => {
    setOpenModalActivityTask(false);
  };

  const closeModalActivityAppointment = () => {
    setOpenModalActivityAppointment(false);
  };

  const closeModalActivityCall = () => {
    setOpenModalActivityCall(false);
  };

  const closeModalConsultingTicket = () => {
    setOpenModalConsultingTicket(false);
  };

  const updateMemberType = (type: MemberType) => {
    setOpenModalMember((prev) => ({ ...prev, type }));
  };

  // --- except id ---

  const handleAddExceptIdMember = (value) => setExceptedMember(value);
  // --- clear store ---

  const clearStore = () => {
    setTypeModalContact("");
    setListProductSelect([]);
    setSelectContact(null);
    setSelectEmployee([]);
    setSelectedMember(null);
    setSelectCustomer(null);
    setSelectedLead(null);
    setSelectedCustomerLead(null);
    setSelectSupplier(null);
    setSelectedSupplierLead(null);
    setSelectedFollower([]);
    setExceptedMember([]);
  };

  const clearActivityStore = () => {
    setSelectActivityTask([]);
    setSelectActivityAppointment([]);
    setSelectActivityCall([]);
    setSelectConsultingTicket([]);
  };

  // ---

  const valueProps = {
    selectContact,
    selectEmployee,
    selectCustomer,
    selectedLead,
    selectedCustomerLead,
    selectedSupplierLead,
    selectSupplier,
    selectedMember,
    exceptedMember,
    selectedFollower,
    memberType: openModalMember?.type,
    selectActivityTask,
    selectActivityAppointment,
    selectActivityCall,
    selectConsultingTicket,
    listProductSelect,
    openModalSelectContact,
    openModalSelectProduct,
    openModalCustomer,
    openModalLead,
    openModalCustomerLead,
    openModalSupplier,
    openModalSupplierLead,
    openModalContact,
    openModalActivityTask,
    openModalActivityAppointment,
    openModalActivityCall,
    openModalConsultingTicket,
    openModalMember,
    openModalFollower,
    typeModalContact,
    listId,
    typeOrder,
    title,
    openModalEmployee,
    setIds,
    handleOpenModalContactOrder,
    handleOpenModalContact,
    handleOpenModalProduct,
    handleOpenModalCustomer,
    handleOpenModalLead,
    handleOpenModalCustomerLead,
    handleOpenModalSupplier,
    handleOpenModalSupplierLead,
    handleOpenModalEmployee,
    handleOpenModalActivityTask,
    handleOpenModalActivityAppointment,
    handleOpenModalActivityCall,
    handleOpenModalConsultingTicket,
    handleOpenModalMember,
    handleOpenModalFollower,
    closeModalContactOrder,
    closeModalContact,
    closeModalProduct,
    closeModalCustomer,
    closeModalLead,
    closeModalCustomerLead,
    closeModalSupplierLead,
    closeModalSupplier,
    closeModalEmployee,
    closeModalActivityTask,
    closeModalActivityAppointment,
    closeModalActivityCall,
    closeModalConsultingTicket,
    closeModalMember,
    closeModalFollower,
    clearStore,
    clearActivityStore,
    handleSelectItemContact,
    handleSelectItemCustomer,
    handleSelectItemLead,
    handleSelectItemCustomerLead,
    handleSelectItemSupplier,
    handleSelectItemSupplierLead,
    handleSelectItemEmployee,
    handleSelectActivityTask,
    handleSelectActivityAppointment,
    handleSelectActivityCall,
    handleSelectConsultingTicket,
    handleSelectItemMember,
    handleSelectItemFollower,
    handleRemoveItemEmployee,
    handleRemoveItemMember,
    handleRemoveItemActivity,
    handleAddListProduct,
    handleDeleteProduct,
    handleChangeTypeOrder,
    updateMemberType,
    handleAddExceptIdMember,
  };

  return (
    <CrmContext.Provider value={valueProps}>{children}</CrmContext.Provider>
  );
}

export function useCrmClient() {
  return useContext(CrmContext);
}
