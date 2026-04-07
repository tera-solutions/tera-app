import { useMutationLegacy } from "@tera/commons/hooks/tanstack";

import moment from "moment";
import { downloadFile, notification } from "tera-dls";

import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import { ItemCode } from "../interface";
import ImportExportApi from "../_api";

interface IProps {
  itemCode: ItemCode | string;
  onSuccess?: () => void;
}

const useDownloadImportTemplate = ({ itemCode, onSuccess }: IProps) => {
  const { mutate: onDownload } = useMutationLegacy({
    mutationFn: () =>
      ImportExportApi.getTemplate({
        params: {
          item_code: itemCode,
        },
      }),

    onSuccess: (res) => {
      if (res?.code === 200) {
        notification.success({
          message: res?.msg,
        });
        const date = moment().format("DDMMYYYY_HHmmss");
        downloadFile(res?.data?.src, `template_${itemCode as string}_${date}`);
        onSuccess && onSuccess();
      }
    },

    onError: (error: any) => {
      ErrorToast({ errorProp: error?.data });
    },
  });

  return { onDownload };
};

export default useDownloadImportTemplate;
