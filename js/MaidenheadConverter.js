var MaidenheadConverter = {
	DEG_25: 2.5 / 60, // 2.5 degrees
	DEG_50: 5.0 / 60, // 5.0 degrees

	convertFrom: function( gridRef ) {
		// TODO: validate the input
		var lon = 0.0, lat = 0.0;

		var gridCorner = this.calculateGridCorner( gridRef );
		lat = gridCorner[0];
		lon = gridCorner[1];

		// Center the coords to the middle of the grid square
		switch( gridRef.length ) {
			case 2:
				lon += 10;
				lat += 5;
				break;
			case 4:
				lon += 1;
				lat += 0.5;
				break;
			case 6:
				lon += this.DEG_50 / 2;
				lat += this.DEG_25 / 2;
				break;
		}

		return [lat, lon];
	},

	convertTo: function( lon, lat ) {
		// TODO: validate the input
		var charA = "A".charCodeAt( 0 );
		var char0 = "0".charCodeAt( 0 );

		var workingLon = Math.min( 180 + lon, 359.999999999 );
		var workingLat = Math.min( 90 + lat, 179.999999999 );

		var gridRef = String.fromCharCode( charA + (workingLon / 20) );
		gridRef += String.fromCharCode( charA + (workingLat / 10) );
		gridRef += String.fromCharCode( char0 + (workingLon % 20) / 2 );
		gridRef += String.fromCharCode( char0 + workingLat % 10 );
		gridRef += String.fromCharCode( charA + (workingLon % 20 % 2) / this.DEG_50 ).toLowerCase();
		gridRef += String.fromCharCode( charA + (workingLat % 10 % 1) / this.DEG_25 ).toLowerCase();

		return gridRef;
	},

	calculateGridCorner: function( gridRef ) {
		var charA = "A".charCodeAt( 0 );
		var char0 = "0".charCodeAt( 0 );
		var ucGridRef = gridRef.toUpperCase();

		var lon = (ucGridRef.charCodeAt( 0 ) - charA) * 20 - 180;
		var lat = (ucGridRef.charCodeAt( 1 ) - charA) * 10 - 90;

		if( ucGridRef.length >= 4 ) {
			lon += (ucGridRef.charCodeAt( 2 ) - char0) * 2;
			lat += ucGridRef.charCodeAt( 3 ) - char0;

			if( ucGridRef.length >= 6 ) {
				lon += (ucGridRef.charCodeAt( 4 ) - charA) * this.DEG_50;
				lat += (ucGridRef.charCodeAt( 5 ) - charA) * this.DEG_25;
			}
		}

		return [lat, lon];
	},

	/*
	 * returns an array of points
	 */
	calculateGridPolygon: function( gridRef ) {
		var p1, p2, p3, p4;

		p1 = this.calculateGridCorner( gridRef );

		var latInc, lonInc;
		switch( gridRef.length ) {
			case 2:
				latInc = 10;
				lonInc = 20;
				break;
			case 4:
				latInc = 1;
				lonInc = 2;
				break;
			case 6:
				latInc = this.DEG_25;
				lonInc = this.DEG_50;
				break;
		}

		p2 = [p1[0],          p1[1] + lonInc];
		p3 = [p1[0] + latInc, p1[1] + lonInc];
		p4 = [p1[0] + latInc, p1[1]         ];

		return [p1, p2, p3, p4];

	}
}
