<?php

// Dashboard
Breadcrumbs::for('backend.dashboard', function ($trail) {
    $trail->push('Dashboard', route('backend.dashboard'));
});
