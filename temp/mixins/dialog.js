export default {
    props: {
        top: {
            type: String,
            default: '15vh',
        },
        width: {
            type: String,
            default: '90%',
        },
    },
    data() {
        return {
            isShow: false,
        };
    },
    methods: {
        open() {
            this.isShow = true;
        },
        close() {
            this.isShow = false;
        },
    },
}