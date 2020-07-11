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
  adminCheck: boolean;
  constructor(
    private utilitiesService: UtilitiesService,
    private router: Router,
    public sanitizer: DomSanitizer
  ) {
    this.devices = this.utilitiesService.getDevice();
    this.adminCheck = false;
    this.role = getRole();
    if (this.role && this.role.refHero.isSuperAdmin) {
      this.adminCheck = true;
    }
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
        icon: "https://www.img.in.th/images/b96c1fb2b6e3816ca43df931073f6339.png"
      },
      {
        name: "Create Online Exam Form",
        description: "สร้างแบบข้อสอบออนไลน์ในแบบของคุณ สะดวก ง่าย รวดเร็ว จับเวลาในการสอบได้",
        url: "https://www.youtube.com/embed/_5fQ9cjrB2g?autoplay=1",
        icon: "https://www.img.in.th/images/5956310e94d277a08769e6c11b1b0d72.png"
      },
      {
        name: "Create Evalution Form and give score",
        description: "สร้างแบบฟอร์มการประเมินพร้อมให้คะแนนระหว่างการสัมภาษณ์",
        url: "https://www.youtube.com/embed/082TxIzQxZI?autoplay=1",
        icon: "https://www.img.in.th/images/5ecc611c4c0fe6a39a89592b8d2edb3c.png"
      },
      {
        name: "Sync Calendar with Gmail/Outlook",
        description: "จัดตารางเวลาได้ง่าย ด้วยการเชื่อมต่อปฏิทินภายนอกได้หลากหลาย เช่น Outlook,Gmail",
        url: "https://www.youtube.com/embed/GpmjmYVfEx8?autoplay=1",
        icon: "https://www.img.in.th/images/88203e65e712c521f44b406653098d52.png"
      },
      {
        name: "Candidate Report / Detail Report",
        description: "แบบรายงานสรุปข้อมูล พร้อม save เป็น Excel",
        url: "https://www.youtube.com/embed/4uMuU5CJz7g?autoplay=1",
        icon: "https://www.img.in.th/images/474e5d0bd98e0d1cc36cdaa1bab342ed.png"
      },
      {
        name: "Blacklist",
        description: "จัดเก็บประวัติผู้สมัครในทุกขั้นตอน แจ้งเตือนเมื่อผู้สมัครใน blacklist ทำการสมัครเข้ามา",
        url: "https://www.youtube.com/embed/b4wsOO81CNY?autoplay=1",
        icon: "https://www.img.in.th/images/dfa4a2ca16a8649601a33d1c3bc3e224.png"
      },
      {
        name: "Data Security & Privacy Compliance",
        description: "นโยบายความเป็นส่วนตัวของข้อมูลส่วนบุคคลในยุคนี้ถือเป็นสิ่งที่สำคัญ นอกจากระบบ security ที่ดีแล้ว เรายังมีระบบ Consent management รองรับ พรบ.คุ้มครองข้อมูลส่วนบุคคล อีกด้วย",
        url: "https://www.youtube.com/embed/0SOCmaf59mM?autoplay=1",
        icon: "https://www.img.in.th/images/34623259e535389b0543186b301fd017.png"
      },
      {
        name: "Search in Keywords",
        description: "ค้นหาคำที่ต้องการได้ง่ายเพียงรู้ keyword",
        url: "https://www.youtube.com/embed/Zw-mx-Rzakk?autoplay=1",
        icon: "https://www.img.in.th/images/61841c3008e17b85a359e8cf425c268b.png"
      },
      {
        name: "Dashboard visualization (Statistical Analysis)",
        description: "มีรายงานให้เลือกใช้หลากหลาย เพื่อให้เห็นภาพรวมและ detail ในระบบ Recruitment ของคุณ",
        url: "https://www.youtube.com/embed/VnC53e6gt4E?autoplay=1",
        icon: "https://www.img.in.th/images/b0a65ea6dfe52320eef7e569ff32020c.png"
      },
      {
        name: "Candidate Transfer",
        description: "โอนย้าย Candidate ได้ข้ามสายงานหรือสาขาได้เลย",
        url: "https://www.youtube.com/embed/8m-nlvjAmXQ?autoplay=1",
        icon: "https://www.img.in.th/images/e05619bde3d8738ce74607912ea2b95b.png"
      },
      {
        name: "Send Automation Email (Internal/External)",
        description: "อีเมลส่งอัตโนมัติทั้งในและนอกระบบ แจ้ง/นัดหมาย รู้ทุกความเคลื่อนไหว หมดปัญหาไม่ทราบสถานะของการสมัครงาน",
        url: "https://www.youtube.com/embed/5kWdBVXYwHk?autoplay=1",
        icon: "https://www.img.in.th/images/fa94a2ce4cf405e7ccbe3aafe19b39f6.png"
      },
      {
        name: "Notification",
        description: "Process flow ราบรื่นและรวดเร็ว โดยแจ้งเตือนการทำงาน ให้การ Recruitment ไม่สะดุด ",
        url: "https://www.youtube.com/embed/DhYXmU1sWZA?autoplay=1",
        icon: "https://www.img.in.th/images/53de5e0ea14a095d8246a456344b98df.png"
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
