<aside id="sidebar-left" class="sidebar-left">
    <div class="sidebar-header">
        <div class="sidebar-title">
            Navigation
        </div>
        <div class="sidebar-toggle d-none d-md-block" data-toggle-class="sidebar-left-collapsed" data-target="html"
            data-fire-event="sidebar-left-toggle">
            <i class="fas fa-bars" aria-label="Toggle sidebar"></i>
        </div>
    </div>
    <div class="nano">
        <div class="nano-content">
            <nav id="menu" class="nav-main" role="navigation">
                <ul class="nav nav-main">
                    <li class="{{ Route::is('backend.dashboard') ? 'nav-active' : '' }}">
                        <a class="nav-link" href="{{ route('backend.dashboard') }}">
                            <i class="fas fa-home" aria-hidden="true"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="nav-parent {{ Route::is('backend.users.*') ? 'nav-expanded nav-active' : '' }}">
                        <a class="nav-link" href="#">
                            <i class="fas fa-lock" aria-hidden="true"></i>
                            <span>Authentication</span>
                        </a>
                        <ul class="nav nav-children">
                            <li class="{{ Route::is('backend.users.*') ? 'nav-active' : '' }}">
                                <a class="nav-link" href="{{ route('backend.users.index') }}">
                                    Users
                                </a>
                            </li>
                            <li>
                                <a class="nav-link" href="">
                                    Roles
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</aside>