<template>
    <nav class="pk-app-nav navbar navbar-default"
         :id="`pk-app-nav-${_uid}`">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand"
                   href="/">Password Keeper</a>
            </div>
            <ul class="nav navbar-nav">
                <router-link active-class="active"
                             tag="li"
                             to="/home"><a>{{ $t('link.home') }}</a></router-link>
                <router-link active-class="active"
                             tag="li"
                             to="/config"><a>{{ $t('link.config') }}</a></router-link>
                <router-link active-class="active"
                             tag="li"
                             to="/about"><a>{{ $t('link.about') }}</a></router-link>
            </ul>
        </div>
        <!--/.container-fluid -->
    </nav>
</template>
