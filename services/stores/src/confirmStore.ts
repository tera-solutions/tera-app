import { makeAutoObservable, toJS, observable } from "mobx";
import { IConfirmStore } from "./_interface";
import * as CSS from "csstype";

export class ConfirmStore {
  openConfirm = false;
  onOk: any = null;
  onCancel: any = null;
  content: any = null;
  type: any = null;
  align: CSS.Property.TextAlign = "center";
  props = {} as any;

  constructor() {
    makeAutoObservable(
      this,
      {
        content: observable.ref,
        props: observable.ref,
        onOk: false,
        onCancel: false,
      },
      { autoBind: true },
    );
  }

  pushEvent() {
    const snapshot = toJS({
      openConfirm: this.openConfirm,
      content: this.content,
      type: this.type,
      align: this.align,
      props: this.props,
    });

    const event = new CustomEvent("ConfirmStore", {
      detail: snapshot,
    });
    window.dispatchEvent(event);
  }

  setOpenConfirm = (value: IConfirmStore) => {
    this.openConfirm = true;
    this.onOk = value?.onOk || null;
    this.onCancel = value?.onCancel || null;
    this.content = value?.content || null;
    this.type = value?.type || null;
    this.align = value?.align || "center";
    this.props = value?.props || {};
    this.pushEvent();
  };

  setCloseConfirm = () => {
    this.openConfirm = false;
    this.onOk = null;
    this.onCancel = null;
    this.content = null;
    this.type = null;
    this.props = {};
    this.pushEvent();
  };
}
