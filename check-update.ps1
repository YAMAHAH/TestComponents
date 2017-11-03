$updatePakages = npm outdated --parseable --depth=0
# foreach ($item in $updatePakages) {
#     ($item | Out-String).Split(":")[4]
# }

foreach($item2 in $updatePakages){
    $package = ($item2 -split ":")[-1]
    npm install "$package"
}

