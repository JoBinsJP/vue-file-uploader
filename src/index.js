import FileUpload from "./FileUpload.vue"

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("v-breadcrump", FileUpload);
}

const plugin = {
  install
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

FileUpload.install = install;

export default FileUpload;