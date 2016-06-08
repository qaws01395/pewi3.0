function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

function updateHUD() {
    var text ;
    text = "x: " + Math.floor(camera.position.x) ;
    text += "  y: " + Math.floor(camera.position.y) ;
    text += "  z: " + Math.floor(camera.position.z)  ;
    text += "<br>";
    text += "  rx: " + Math.floor(camera.rotation.x) ;
    text += "  ry: " + Math.floor(camera.rotation.y) ;
    text += "  rz: " + Math.floor(camera.rotation.z) ;
    
    document.getElementById("pos").innerHTML = text ;
}

function setUpBoard(board) {
    
    for(var i = 0; i < board.map.length; i++){
        
        addTile(board.map[i]);
        
    }
    
};

function addTile(tile){
    
        var tilesWide = currentBoard.width;
        var tilesHigh = currentBoard.height;
    
        var tileHeight = 12;
        var tileWidth = 18;
        
        var tileGeometry = new THREE.BoxGeometry(tileWidth, 0, tileHeight);
        
        if(tile.landType[1] == 0){
            tileMaterial = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.0});
        } else {
            tileMaterial = new THREE.MeshLambertMaterial({ map: textureArray[tile.landType[1]] });
        }
        
        var newTile = new THREE.Mesh(tileGeometry, tileMaterial);
        newTile.position.x = tile.column * tileWidth - (tileWidth * tilesWide)/2;
        newTile.position.y = 0;
        newTile.position.z = tile.row * tileHeight - (tileHeight * tilesHigh)/2;
        
        newTile.mapID = tile.id - 1;
        
        tile.graphics = newTile;
        
        tiles.push(tile.graphics);
        
        scene.add(tile.graphics);
    
};


function addBoard(board) {
    
    var tilesHigh = board.height;
    var tilesWide = board.width;
    
   // console.log(board.height + " " + board.width);
    
    var tileHeight = 12;
    var tileWidth = 18;

    var tileIndex = 0 ;

    var landUseArray = [] ;
    for(var i = 0; i < board.map.length ; i++){
        landUseArray.push(board.map[i].landType[1]) ;
    }

    for (var j = 0; j < tilesHigh; j++) {

        for (var i = 0; i < tilesWide; i++) {

            //var r = Math.floor((Math.random() * 14));

            var tileGeometry = new THREE.BoxGeometry(tileWidth, 0, tileHeight);
         
            var tileMaterial;
         
        if(landUseArray[tileIndex] == 0){
            tileMaterial = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.0});
        } else {    
            tileMaterial = new THREE.MeshLambertMaterial({
                map: textureArray[landUseArray[tileIndex]]
            });
        }

            var newTile = new THREE.Mesh(tileGeometry, tileMaterial);
            newTile.position.x = i * tileWidth - (tileWidth * tilesWide)/2;
            newTile.position.y = 0;
            newTile.position.z = j * tileHeight - (tileHeight * tilesHigh)/2;
            
            //Charlie
            newTile.data = board.map[i];

            tiles.push(newTile);

            scene.add(newTile);
            
            tileIndex ++ ;

        }

    }
    
}//end addBoard()

function onDocumentMouseMove( event ) {
    
	event.preventDefault();
	
	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
	
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = raycaster.intersectObjects(tiles);
	
	if ( intersects.length > 0 ) {

		if ( hoveredOver != intersects[ 0 ].object ) {

			if ( hoveredOver ) hoveredOver.material.emissive.setHex( hoveredOver.currentHex );

			hoveredOver = intersects[ 0 ].object;
			hoveredOver.currentHex = hoveredOver.material.emissive.getHex();
			hoveredOver.material.emissive.setHex( 0xff0000 );

		}

	}
	
	renderer.render(scene, camera);
	
}; //onDocumentMouseMove

function onDocumentMouseDown( event ) {
    
	event.preventDefault();
	
	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = raycaster.intersectObjects( tiles );
	
	if ( intersects.length > 0 ) {
	    
		var intersect = intersects[ 0 ];
		
		console.log(currentBoard.map[hoveredOver.mapID].landType[1]);
		
		if(currentBoard.map[hoveredOver.mapID].landType[1] != 0){
		    
		    currentBoard.map[hoveredOver.mapID].landType[1] = 1;
		
		    currentBoard.map[hoveredOver.mapID].update();
		    
    		scene.remove(hoveredOver);
    		
            addTile(currentBoard.map[hoveredOver.mapID]);
            
		}
		
		console.log(currentBoard.map[hoveredOver.mapID].landType[1]);
			
		renderer.render(scene, camera);
	}
}