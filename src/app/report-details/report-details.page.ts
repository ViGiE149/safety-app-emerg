import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { first } from 'rxjs';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.page.html',
  styleUrls: ['./report-details.page.scss'],
})
export class ReportDetailsPage implements OnInit {
  report: any;
reportID:any;
  constructor(private firestore:AngularFirestore ,private platform: Platform,private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
  //   this.route.queryParams.subscribe((params) => {
  //     this.report = params['report'];
  //     if (!this.report) {
  //       alert("error");
  //       // Handle the error case, e.g., redirect or show an error message
  //     }
  //   });
  this.route.queryParams.subscribe((params) => {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras.state) {
      this.report = currentNavigation.extras.state['Report'];
      console.log(this.report);
    } else {
      console.error("Navigation extras or state is null.");
      // Handle the error case, e.g., redirect or show an error message
    }
  });
  
    // this.profileArray = Object.values(this.router.getCurrentNavigation().extras.state.user)[0];
    //       this.name = Object.values( this.profileArray)[1];
    //      this.surname=Object.values( this.profileArray)[2];
    //       this.username = Object.values( this.profileArray)[3];
    //       this.email=Object.values( this.profileArray)[4];
    //       this.contact=Object.values( this.profileArray)[5];
    //       console.log(this.name);
  //  }
 // });



  }

  formatTimestamp(timestamp: any): string {
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
      const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
      const date = new Date(milliseconds);
      // Adjust the date formatting according to your needs
      return date.toLocaleString(); // or use your preferred date formatting method
    } else {
      return 'Invalid date';
    }
  }

  callNumber(phoneNumber: string): void {
    if (this.platform.is('cordova')) {
      window.open(`tel:${phoneNumber}`, '_system');
    } else {
      console.log('Calling functionality is supported only on mobile devices.');
      // You might want to provide a user-friendly message or alternative action
    }
  }



  async notify(reportID: any): Promise<void> {
    try {
      // Query to find the document with the specified reportID
      const querySnapshot = await this.firestore
        .collection('reports', (ref) => ref.where('reportID', '==', reportID))
        .valueChanges({ idField: 'id' })
        .pipe(first())
        .toPromise();
  
      // Check if any document matches the query
      if (querySnapshot && querySnapshot.length > 0) {
        // Assuming there's only one document with the specified reportID
        const docId = querySnapshot[0].id;
  
        // Get a reference to the document using the retrieved document ID
        const reportRefR = this.firestore.collection('reports').doc(docId);
  
        // Update the document with the new reportStatus
        await reportRefR.update({ reportStatus: "true" });
  
        console.log(`Report with ID ${reportID} updated successfully.`);
  
        // Notify the user
        alert('Notified');
      const   reportRefRH = this.firestore.collection('reports').doc(docId);
        // Add the report to the "reports-history" collection
        const reportData = await reportRefRH.get().toPromise();
        if (reportData?.exists) {
          const historyRef = this.firestore.collection('reports-history').doc(docId);
          await historyRef.set(reportData.data());
          console.log(`Report added to reports-history collection.`);
            await  reportRefR.delete();
            this.router.navigateByUrl("/reports");
        } else {
          console.error(`No document found with reportID ${reportID}`);
          // Handle the case where no document is found
        }
      } else {
        console.error(`No document found with reportID ${reportID}`);
        // Handle the case where no document is found
      }
    } catch (error) {
      console.error('Error updating report:', error);
      // You might want to handle this error in your component
    }
  }
  
}



