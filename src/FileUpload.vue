<template>
    <div>
        <div class="form">
            <input ref="fileUpload"
                   type="file"
                   class="hide-button"
                   :disabled="!canUpload"
                   :multiple="multipleUpload"
                   @change="onFileSelect">
            <input v-if="button"
                   type="button"
                   class="btn btn-primary"
                   value="Upload"
                   @click="uploadScreen()">
        </div>
    </div>
</template>
<script>
    const EVENTS = {
        updated: "updated",
    }
    export default {
        props: {
            mime: { type: String, required: false, default: "0" },
            url: { type: String, required: false, default: "" },
            multipleUpload: { type: Boolean, required: false, default: false },
            maxUpload: { type: Number, required: false, default: 1 },
            button: { type: Boolean, required: false, default: false },
            size: { type: Number, required: false, default: 10 },
            token: { type: String, required: false, default: window.csrf_token },
        },
        data: () => {
            return {
                selectedFile: null,
                mimeType: null,
                fileStorage: [], // for file counting
            }
        },
        computed: {
            mimes: function() {
                if (this.mime && this.mime.trim() !== "") {
                    return this.mime.split(",")
                } else { return [] }
            },
            canUpload: function() {
                return this.fileStorage.length < this.maxUpload
            },
        },
        methods: {
            onFileSelect(event) {
                if (this.multipleUpload) {
                    const files = event.target.files
                    const uploadLimit = this.maxUpload - this.fileStorage.length
                    console.log(`upload limit ::${uploadLimit}`)
                    const loopUntil = files.length < uploadLimit ? files.length : uploadLimit
                    for (let i = 0; i < loopUntil; i++) {
                        if (this.validFile(files.item(i))) {
                            this.processValidFile(files.item(i))
                        }
                    }
                } else {
                    const file = event.target.files.item(0)
                    this.processValidFile(file)
                }
            },
            validFile(file) {
                if (this.mime === "0" || this.mime.trim() === "") {
                    return true// no mimes for checking
                }
                return this.mimes.contains(file.type)
            },
            uploadScreen() {
                if (this.canUpload) {
                    this.$refs.fileUpload.value = null
                    this.$refs.fileUpload.click()
                }
            },
            async uploadFile(file) {
                const formData = new FormData()
                formData.append("_token", this.token ?? "")
                formData.append("image", file, file.fileName)

                try {
                    let response = await fetch(this.url, {
                        method: "post",
                        body: formData,
                    })
                    // this also means the request failed
                    if (response.status !== 200) {
                        throw new Error("Cannot be uploaded")
                    }
                    response = await response.json()
                } catch (e) {
                    console.error("Cannot upload widget image to server ".e.getMessage())
                }
            },
            processValidFile(f) {
                if (this.canUpload) {
                    // this.uploadFile(f);
                    this.updateFileList(f)
                }
            },
            updateFileList(f) {
                this.fileStorage.push(f)
                this.listUpdated()
                // add to store here to access from different section of the app or not
            },
            listUpdated() {
                this.$emit(EVENTS.updated, this.fileStorage.map((f, i) => {
                    return { index: i, file: f }
                }))
            },
            removeFile(index) {
                this.fileStorage = this.fileStorage.filter((f, i) => {
                    return i !== index
                })
                this.listUpdated()
            },

        },
    }
</script>
<style>
.hide-button {
  display: none
}
</style>
