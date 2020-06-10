import { Component, OnInit } from '@angular/core';
import { Devices } from '../../shared/interfaces/common.interface';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { setPathName, getRole } from '../../shared/services';
import { Router } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'ngx-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
  features: any;
  item: any;
  itemIndex: any;
  showStart: boolean;
  devices: Devices;
  navFeature: boolean;
  navContact: boolean;
  role: any;
  urlSafe: SafeResourceUrl;
  constructor(
    private utilitiesService: UtilitiesService,
    private router: Router,
    public sanitizer: DomSanitizer
  ) {
    this.devices = this.utilitiesService.getDevice();
    this.role = getRole();
  }

  ngOnInit() {
    this.item = {};
    this.navContact = false;
    this.navFeature = true;
    this.features = [
      {
        name: "AI (Artificial Intelligence) technique",
        description: "ระบบการคัดเลือก Candidateโดยการ matching qualification score",
        url: "https://www.youtube.com/embed/pq4JSqBaXwA?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/9699f317a38721deda198990d7dd35bd.png"
      },
      {
        name: "Create Online Exam Form",
        description: "สร้างแบบข้อสอบออนไลน์ในแบบของคุณ สะดวก ง่าย รวดเร็ว จับเวลาในการสอบได้",
        url: "https://www.youtube.com/embed/_5fQ9cjrB2g?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/60d8ff4e434ee43af1bc326020fb767d.png"
      },
      {
        name: "Create Evalution Form and give score",
        description: "สร้างแบบฟอร์มการประเมินพร้อมให้คะแนนระหว่างการสัมภาษณ์",
        url: "https://www.youtube.com/embed/082TxIzQxZI?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/d6ffc99e91c2abb63f2d55de6646504d.png"
      },
      {
        name: "Sync Calendar with Gmail/Outlook",
        description: "จัดตารางเวลาได้ง่าย ด้วยการเชื่อมต่อปฏิทินภายนอกได้หลากหลาย เช่น Outlook,Gmail",
        url: "https://www.youtube.com/embed/GpmjmYVfEx8?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/4b8c1240b97f110ae5189879e825b160.png"
      },
      {
        name: "Candidate Report / Detail Report",
        description: "แบบรายงานสรุปข้อมูล พร้อม save เป็น Excel",
        url: "https://www.youtube.com/embed/4uMuU5CJz7g?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/e12733c1709131a8618be743d9b6ab16.png"
      },
      {
        name: "Blacklist",
        description: "จัดเก็บประวัติผู้สมัครในทุกขั้นตอน แจ้งเตือนเมื่อผู้สมัครใน blacklist ทำการสมัครเข้ามา",
        url: "https://www.youtube.com/embed/b4wsOO81CNY?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/e0cfe47406a41a92979e806b850e96d8.png"
      },
      {
        name: "Data Security & Privacy Compliance",
        description: "นโยบายความเป็นส่วนตัวของข้อมูลส่วนบุคคลในยุคนี้ถือเป็นสิ่งที่สำคัญ นอกจากระบบ security ที่ดีแล้ว เรายังมีระบบ Consent management รองรับ พรบ.คุ้มครองข้อมูลส่วนบุคคล อีกด้วย",
        url: "https://www.youtube.com/embed/0SOCmaf59mM?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/7c1aa1364bcb85f23ed5eb23eb3c1576.png"
      },
      {
        name: "Search in Keywords",
        description: "ค้นหาคำที่ต้องการได้ง่ายเพียงรู้ keyword",
        url: "https://www.youtube.com/embed/Zw-mx-Rzakk?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/6dc5ac9ae5bf13e9ef198975c0823c50.png"
      },
      {
        name: "Dashboard visualization (Statistical Analysis)",
        description: "มีรายงานให้เลือกใช้หลากหลาย เพื่อให้เห็นภาพรวมและ detail ในระบบ Recruitment ของคุณ",
        url: "https://www.youtube.com/embed/VnC53e6gt4E?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/05998a89d4b81348eb2ad151b200d948.png"
      },
      {
        name: "Candidate Transfer",
        description: "โอนย้าย Candidate ได้ข้ามสายงานหรือสาขาได้เลย",
        url: "https://www.youtube.com/embed/8m-nlvjAmXQ?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/2845cf4bf1a1cfcd4d7639463cf88941.png"
      },
      {
        name: "Send Automation Email (Internal/External)",
        description: "อีเมลส่งอัตโนมัติทั้งในและนอกระบบ แจ้ง/นัดหมาย รู้ทุกความเคลื่อนไหว หมดปัญหาไม่ทราบสถานะของการสมัครงาน",
        url: "https://www.youtube.com/embed/5kWdBVXYwHk?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/f3b89959670e7120cc887000e7fb9d8a.png"
      },
      {
        name: "Notification",
        description: "Process flow ราบรื่นและรวดเร็ว โดยแจ้งเตือนการทำงาน ให้การ Recruitment ไม่สะดุด ",
        url: "https://www.youtube.com/embed/DhYXmU1sWZA?autoplay=1",
        icon: "https://s3-ap-southeast-1.amazonaws.com/img-in-th/8d4a9fbdadceefb09993c47a4805da9b.png"
      },
    ];
    this.item = this.features[0];
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.item.url);
    this.itemIndex = 0;
  }

  selectFeature(index, element) {
    element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    this.item = this.features[index];
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.item.url);
    this.itemIndex = index;
  }

  scrollToElement(element, name): void {
    this.navFeature = false;
    this.navContact = false;
    switch (name) {
      case 'top':
        this.navFeature = true;
        break;
      case 'contact':
        this.navContact = true;
        break;
      default:
        break;
    }
    element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  changePath(name) {
    setPathName(name);
    this.router.navigate(['/index']);
  }

}
