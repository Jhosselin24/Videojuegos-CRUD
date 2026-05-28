// tabs.page.ts
import { Component } from '@angular/core';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class TabsPage {}

/* ==========================================
   tabs.page.scss
   ========================================== */
/*
.tab-bar-gamer {
  --background: rgba(10, 15, 30, 0.95);
  --color: #475569;
  --color-selected: #60a5fa;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  padding-bottom: env(safe-area-inset-bottom);
  height: 62px;
}
*/