
cc.Class({
    extends: cc.Component,

    properties: {
        label_1:{
            default:null,
            type:cc.Label
        },
        label_2:{
            default:null,
            type:cc.Label
        },
       
    },

    onLoad () {
        this.str_1 = ''
    },

    //按钮点击回调
    btnCallBack:function(sender,str){
       switch (str) {
           case 'btn_zuo':
                this.str_1 = this.str_1 + '('
                this.label_1.string = this.str_1
               break;
            case 'btn_you':
                this.str_1 = this.str_1 + ')'
                this.label_1.string = this.str_1
            break;
            case 'btn_baiFenHao':
                this.str_1 = this.str_1 + '/100'
                this.label_1.string = this.str_1
            break;
            case 'btn_qingChu':
                this.str_1 = ''
                this.label_1.string = this.str_1
                this.label_2.string = this.str_1
            break;
            case 'btn_7':
                this.str_1 = this.str_1 + '7'
                this.label_1.string = this.str_1
            break;
            case 'btn_8':
                this.str_1 = this.str_1 + '8'
                this.label_1.string = this.str_1
            break;
            case 'btn_9':
                this.str_1 = this.str_1 + '9'
                this.label_1.string = this.str_1
            break;
            case 'btn_chu':
                this.str_1 = this.str_1 + '/'
                this.label_1.string = this.str_1
            break;
            case 'btn_4':
                this.str_1 = this.str_1 + '4'
                this.label_1.string = this.str_1
            break;
            case 'btn_5':
                this.str_1 = this.str_1 + '5'
                this.label_1.string = this.str_1
            break;
            case 'btn_6':
                this.str_1 = this.str_1 + '6'
                this.label_1.string = this.str_1
            break;
            case 'btn_cheng':
                this.str_1 = this.str_1 + '*'
                this.label_1.string = this.str_1
            break;
            case 'btn_1':
                this.str_1 = this.str_1 + '1'
                this.label_1.string = this.str_1
            break;
            case 'btn_2':
                this.str_1 = this.str_1 + '2'
                this.label_1.string = this.str_1
            break;
            case 'btn_3':
                this.str_1 = this.str_1 + '3'
                this.label_1.string = this.str_1
            break;
            case 'btn_jian':
                this.str_1 = this.str_1 + '-'
                this.label_1.string = this.str_1
            break;
            case 'btn_0':
                this.str_1 = this.str_1 + '0'
                this.label_1.string = this.str_1
            break;
            case 'btn_dian':
                this.str_1 = this.str_1 + '.'
                this.label_1.string = this.str_1
            break;
            case 'btn_jia':
                this.str_1 = this.str_1 + '+'
                this.label_1.string = this.str_1
            break;
            case 'btn_dengYu':
                this.label_2.string = this.str_1 + '='
                try{
                    this.label_1.string = eval(this.str_1)
                }catch(exception){
                    this.label_1.string = '错误'
                }
                
            break;
       
           default:
               break;
       }
    },

    start () {
        //cc.log('start')
    },

    update (dt) {//一秒钟执行60次
        //cc.log('update：'+dt)
    },
});
