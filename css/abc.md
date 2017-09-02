  <div class="container-fluid leftside-wrap">
        <div class="row">
            <div id="navsidebar" role="navigation" class="sidebar">
                <ul class="nav nav-sidebar">
                    <li [routerLink]="['ScreenControl']" routerLinkActive="navbar-nav-menu">
                        <i class="screen-control"></i>
                        <a>屏幕监控</a>
                    </li>
                    <li>
                        <i class="parking-control"></i>-->
                        <a [routerLink]="['ParkingControl']" routerLinkActive="navbar-nav-menu">停车场监控</a>
                    </li>
                    <li [routerLink]="['ScreenManagement']" routerLinkActive="navbar-nav-menu">
                        <i class="screen-management"></i>
                        <a>屏幕管理</a>
                    </li>
                    <li [routerLink]="['RoadManagement']" routerLinkActive="navbar-nav-menu">
                        <i class="road-management"></i>
                        <a>路段管理</a>
                    </li>
                    <li [routerLink]="['ParkingManagement']" routerLinkActive="navbar-nav-menu">
                        <i class="parking-management"></i>
                        <a>停车场管理</a>
                    </li>
                    <li [routerLink]="['ParkingSourceManagement']" routerLinkActive="navbar-nav-menu">
                        <i class="parking-source-management"></i>
                        <a>停车场来源管理</a>
                    </li>
                    <li [routerLink]="['NoticeList']" routerLinkActive="navbar-nav-menu">
                        <i class="notice-list"></i>
                        <a>通知管理</a>
                    </li>
                    <li [routerLink]="['RangeManagement']" routerLinkActive="navbar-nav-menu">
                        <i class="range-management"></i>
                        <a>值域管理</a>
                    </li>
                    <li [routerLink]="['EmployeeManagement']" routerLinkActive="navbar-nav-menu">
                        <i class="employee-list"></i>
                        <a>人员管理</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>