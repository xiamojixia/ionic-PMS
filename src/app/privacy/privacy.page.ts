import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  standalone: false,
})
export class PrivacyPage {
	  constructor(private alertController: AlertController) {}
  	async showHelp() {
		const alert = await this.alertController.create({
			header: 'Privacy page',
			message: 'Shows our privacy statement.',
			buttons: ['Got it!'],
		});
		await alert.present();
	}
}