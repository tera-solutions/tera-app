import { useStores } from "hooks/useStores";

const useColumnSetting = (objectType: string) => {
  const {
    columnSettingStore: { openModal, closeModal, clearAll, clear, canSetting },
  } = useStores();

  const handleOpenModal = () => openModal(objectType);

  return {
    openModal: handleOpenModal,
    closeModal,
    clear: () => clear(objectType),
    clearAll,
    canSetting: canSetting(objectType),
  };
};

export default useColumnSetting;
