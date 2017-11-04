
$ngPackages =
"@angular/animations",
"@angular/common",
"@angular/compiler",
"@angular/core" ,
"@angular/forms" ,
"@angular/http",
"@angular/platform-browser",
"@angular/platform-browser-dynamic",
"@angular/router",
"@angular/cli",
"@angular/compiler-cli",
"@angularclass/hmr",
"@angularclass/hmr-loader",
"@ngtools/webpack",
"typescript";

# npm install @angular/ {animations, common, compiler,
#     compiler-cli, core, forms, 
#     http, platform-browser, platform-browser-dynamic,
#     platform-server, router}@'^5.0.0'
# typescript@2.4.2
# rxjs@'^5.5.2'
    
# npm install typescript@2.4.2 --save-exact
    
    
./abc.ps1 "path";

set-location
$updatePakages = npm outdated --parseable --depth=0
foreach ($item2 in $updatePakages) {
    $package = ($item2 -split ":")[-1]
    npm install "$package"
}

foreach ($item in $ngPackages) {
    npm install --save "$item"
}
