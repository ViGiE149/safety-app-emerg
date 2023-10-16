import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  reports: any[] = [
    // Initialize with sample data or fetch data directly here
  ];

  constructor( private router:Router,private route: ActivatedRoute,private navCtrl: NavController,private db: AngularFirestore) {}

  ngOnInit() {
    this.loadReports()  // If you want to fetch data here, you can use HTTP requests or other methods
  }

  showReportDetails(someReport: any) {
    console.log("jjj",someReport)
    // Navigating to '/specific-modules' with queryParams
    this.router.navigate(['/report-details'], { queryParams: { report: someReport } });


  }
  loadReports() {
    this.db.collection('reports').valueChanges().subscribe(
      (reports: any[]) => {
        this.reports = reports;
        console.log(this.reports);
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
  }
}
