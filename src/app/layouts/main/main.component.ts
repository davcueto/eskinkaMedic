import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main',
  imports: [RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, NzAvatarModule, NzPopoverModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  isCollapsed = false;
  visible: boolean = false;

  constructor(private router: Router, private authService: AuthService) {

  }

  clickMe(): void {
    this.visible = false;
    this.router.navigate(['/login']);
    localStorage.clear();
    this.authService.logout();
  }

  change(value: boolean): void {
    console.log(value);
  }

}
