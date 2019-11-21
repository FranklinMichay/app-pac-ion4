import { Camera } from '@ionic-native/camera/ngx';

export class CameraMock extends Camera {
  getPicture(options) {
    return new Promise((resolve, reject) => {
      resolve(this.fakeImage);
    })
  }

  fakeImage = "../../assets/imgs/doctor.png";
}