$userFile = $presenceDir.'/'.$user.'.json';

if(file_exists($userFile)){
    unlink($userFile);
}
