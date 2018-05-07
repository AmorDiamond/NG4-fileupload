import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';

const URL = '/v1/files/chat_img/fileUploads';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  chooseImgView: any;
  chooseImgView2: any;
  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  constructor(private http: HttpClient) {}
  ngOnInit() {
    console.log(this.uploader);
    const params = new HttpParams()
      .set('username', '18108285503')
      .set('password', '123456');
    // const params = new FormData();
    //
    // params.append('username', '18108285503');
    // params.append('password', '123456');
    const url = '/login';
    this.http.post(url, params).subscribe(res => {
      console.log(res);
    });
    /*this.http.post(url, {'username': '18108285503', 'password': '123456'}).subscribe(res => {
      console.log(res);
    });*/
  }
  selectedFileOnChanged(event: any) {
    console.log(event.target.files);
    console.log(event.target.files[0]);
    const fileSize = event.target.files[0].size;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      if (fileSize > 1024 * 1024) {
        reader.onload = (e) => {
          console.log( reader.result);  // 或者 e.target.result都是一样的，都是base64码
          this.chooseImgView = reader.result;

          this.getSmallImg(reader.result, 500, (res) => {
            console.log(res);
            this.chooseImgView2 = res;
            const boldFile = this.baseToBlobImg(res);
            console.log(boldFile);
            // this.uploader.uploadAll(); // 开始上传
            this.uploadImg(boldFile);
          });
        };
      }else {

      }
    }
  }
  uploadFileHandel() {
    console.log(this.uploader.queue);
    // this.uploader.queue[0].onSuccess = function (response, status, headers) {
    this.uploader.queue[this.uploader.queue.length - 1].onSuccess = function (response, status, headers) {
      // 上传文件成功
      if (status == 200) {
        // 上传文件后获取服务器返回的数据
        let tempRes = JSON.parse(response);
        console.log(tempRes);

        console.log(this.uploader);
        alert('上传完成！');
      }else {
        // 上传文件后获取服务器返回的数据错误
      }
    };
    // this.uploader.queue[0].upload(); // 开始上传
    this.uploader.uploadAll(); // 开始上传
  }
  /*压缩图片处理*/
  getSmallImg(dataSrc, target, callback) {
    const img = new Image();
    img.src = dataSrc;
    img.onload = () => {
      // 控制上传图片的宽高
      let imgWidth = img.width;
      let imgHeight = img.height;
      if (imgWidth > imgHeight) {
        imgWidth = target;
        imgHeight = Math.ceil(target * img.height / img.width);
      }else if (imgWidth < imgHeight) {
        imgWidth = Math.ceil(target * img.width / img.height);
        imgHeight = target;
      }
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
      const base64code = canvas.toDataURL('image/png', 1);
      if (!canvas || !canvas.getContext) {
        alert('抱歉，你的浏览器不支持 Canvas，请使用现代浏览器操作！');
        return;
      }
      if (callback) {
        return callback(base64code);
      }
    };
  }
  /*将base64的图片转换为blod格式上传*/
  baseToBlobImg(base64code) {
    const arr = base64code.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      u8arr = new Uint8Array(bstr.length);
    let n = bstr.length;
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
  }
  /*将处理好的图片上传*/
  uploadImg(option) {
    const url = '/v1/files/chat_img/fileUploads';
    // 模拟数据
    const formdata = new FormData();
    formdata.append('file', option, 'file_' + (+new Date()) + '.png');
    const file = formdata;
    this.http.post(url, file).subscribe(res => {
      console.log(res);
    });
  }
}
