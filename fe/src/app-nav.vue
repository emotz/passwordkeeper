<template>
    <nav class="app-nav navbar navbar-default"
         :id="`app-nav-${_uid}`">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand"
                   href="/">Password Keeper</a>
            </div>
            <ul class="nav navbar-nav">
                <router-link active-class="active"
                             tag="li"
                             to="/home"><a>Home</a></router-link>
                <router-link active-class="active"
                             tag="li"
                             to="/about"><a>About</a></router-link>
            </ul>
        </div>
        <!--/.container-fluid -->
    </nav>
</template>
