import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';

interface InventoryItem {
	item_id: number;
	item_name: string;
	category: string;
	quantity: number;
	price: number;
	supplier_name: string;
	stock_status: string;
	featured_item: number;
	special_note: string;
}

@Component({
	selector: 'app-add',
	templateUrl: './add.page.html',
	styleUrls: ['./add.page.scss'],
	standalone: false,
})

export class AddPage {
	itemName: string = '';
	supplierName: string = '';
	quantity: number = 0;
	price: number = 0;
	specialNote: string = '';
	category: string = 'Electronics';
	stockStatus: string = 'In Stock';
	featuredItem: number = 0;

	featuredItems: any[] = [];

	apiUrl = 'https://prog2005.it.scu.edu.au/ArtGalley';

	constructor(
		private http: HttpClient,
		private toastController: ToastController,
		private alertController: AlertController
	) {
		this.loadFeaturedItems();
	}

	loadFeaturedItems() {
		this.http.get<InventoryItem[]>(`${this.apiUrl}`).subscribe({
			next: (items) => {
				this.featuredItems = items.filter(item => item.featured_item === 1);
			},
			error: () => {
				console.error('Unable to load Featured Products');
			}
		});
	}

	onSubmit() {
		if (!this.isFormValid()) {
			return;
		}

		const newItem: InventoryItem = {
			item_id: 0,
			item_name: this.itemName,
			supplier_name: this.supplierName,
			quantity: this.quantity,
			price: this.price,
			special_note: this.specialNote,
			category: this.category,
			stock_status: this.stockStatus,
			featured_item: this.featuredItem
		};

		this.http.post(`${this.apiUrl}`, newItem).subscribe({
			next: async () => {
				const toast = await this.toastController.create({
					message: 'Product added successfully!',
					duration: 2000,
					color: 'success',
					position: 'top'
				});
				toast.present();
				this.resetForm();
				this.loadFeaturedItems();
			},
			error: async () => {
				const alert = await this.alertController.create({
					header: 'Error',
					message: 'Failed to add product, please try again later.',
					buttons: ['Cancel']
				});
				await alert.present();
			}
		});
	}

	isFormValid(): boolean {
		return (
			!!this.itemName &&
			!!this.supplierName &&
			this.quantity >= 0 &&
			this.price >= 0 &&
			!!this.stockStatus &&
			!!this.category
		);
	}

	resetForm() {
		this.itemName = '';
		this.supplierName = '';
		this.quantity = 0;
		this.price = 0;
		this.specialNote = '';
		this.category = 'Electronics';
		this.stockStatus = 'In Stock';
		this.featuredItem = 0;
	}

	async showHelp() {
		const alert = await this.alertController.create({
			header: 'Operation Guide',
			message: 'Please fill in the product information and submit. Click the “Add Product” button to submit your data.',
			buttons: ['Got it!'],
		});
		await alert.present();
	}
}