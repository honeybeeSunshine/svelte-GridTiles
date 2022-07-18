<script>
	import { unlockTiles, showDrops, activeTile, dropTarget, dragOrigin } from './stores.js';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function closeTile() {
		dispatch('destroy')
	};

	let thisTile;

	export let colStart = 12;
	export let colEnd = 18;
	export let rowStart = 8;
	export let rowEnd = 14;
	export let zIndex = 2000;


	let moveThis = false;
	let resizeThis = false;
	$: draggable = $unlockTiles && moveThis
	$: $dropTarget, adjustTile();

	function adjustTile() {
		if (thisTile === $activeTile) {
			let x = $dropTarget.split('-');
			let c = +x[1];
			let r = +x[0];
			if (resizeThis) {
				rowEnd = r+1;
				if (resizeThis === 'resizeRight') {
					colEnd = c+1;
				}	else {
					colStart = c;
				}
			}
			else if (moveThis) {
				colEnd = colEnd - colStart + c;
				colStart = c;
				rowEnd = rowEnd - rowStart + r;
				rowStart = r;
			}
			dropTarget.set(null);
			activeTile.set(null);
			showDrops.set(false);
			dispatch('adjust', {"colStart": colStart, "colEnd": colEnd, "rowStart": rowStart, "rowEnd": rowEnd, "zIndex": zIndex})
		}
	}

	function reportDragging({button}) {
		if (button != 0) return
		moveThis=true;
		resizeThis=false; //keep this: quick click bug
		activeTile.set(thisTile);
		showDrops.set(['move',[rowEnd-rowStart,colEnd-colStart]]);
		dragOrigin.set(rowStart+'-'+colStart)
	}

	function reportResize(button, whichCorner) {
		if (button != 0) return
		moveThis=false; //keep this: quick click bug
		resizeThis=whichCorner;
		activeTile.set(thisTile);
		if (whichCorner === 'resizeLeft') {
			dragOrigin.set((rowEnd-1)+'-'+(colStart));
			showDrops.set([whichCorner,[rowStart,colEnd]]);
		} else if (whichCorner === 'resizeRight') {
			dragOrigin.set((rowEnd-1)+'-'+(colEnd-1));
			showDrops.set([whichCorner,[rowStart,colStart]]);
		}
	}

	function moveEnd () {
		moveThis=false;
		if (!resizeThis) {
			activeTile.set(null);
			showDrops.set(false);
			dragOrigin.set(null);
		}
	}

	function resizeEnd () {
		moveThis=false;
		resizeThis=false;
		activeTile.set(null);
		showDrops.set(false);
		dragOrigin.set(null);
	}

	function handle_dragStart(e) {
		e.dataTransfer.setData("text", e.target.id);
		if (/WebKit/.test(navigator.userAgent)) e.dataTransfer.setDragImage(e.target.firstChild, 0, 0)
	}

	function handle_zAdjust(d) {
		zIndex += d;
		dispatch('adjust', {"colStart": colStart, "colEnd": colEnd, "rowStart": rowStart, "rowEnd": rowEnd, "zIndex": zIndex})
	}

</script>

<div class="tile" bind:this={thisTile}
									draggable={draggable}
									on:dragstart={handle_dragStart}
									on:dragend={moveEnd}
									on:click={moveEnd}
									style:grid-column-start={colStart}
									style:grid-column-end={colEnd}
									style:grid-row-start={rowStart}
									style:grid-row-end={rowEnd}
									style:z-index={zIndex}
									>
	{#if $unlockTiles}
		<div id="dragBar" transition:fade>
			<div>
				<svg height="12" width="12">
			  	<circle class="grabBlob" cx="6" cy="6" r="5" fill="orange" on:mousedown={reportDragging}/>
				</svg><span>move</span>
			</div>
			<div>
				<svg height="12" width="12">
					<circle class="pointBlob" cx="6" cy="6" r="5" fill="linen" on:click={() => handle_zAdjust(1)}/>
				</svg><span>raise</span>
			</div>
			<div>
				<svg height="12" width="12">
					<circle class="pointBlob" cx="6" cy="6" r="5" fill="grey" on:click={() => handle_zAdjust(-1)}/>
		  	</svg><span>lower (z={zIndex})</span>
			</div>
		</div>
		<div class="resizeBlob topRight" transition:fade>
			<span>close</span>
			<svg height="12" width="12">
				<circle class="pointBlob" cx="6" cy="6" r="5" fill="red" on:click={closeTile}/>
			</svg>
		</div>
		<div class="resizeBlob resizeLeft" 
				 draggable="true"
				 on:dragstart={handle_dragStart}
				 on:mousedown={({button}) => reportResize(button, 'resizeLeft')} 
				 on:click={resizeEnd}
				 transition:fade>
			<svg height="12" width="12">
				<circle class="grabBlob" cx="6" cy="6" r="5" fill="green"/>
			</svg><span>resize</span>
		</div>
		<div class="resizeBlob resizeRight" 
				 draggable="true" 
				 on:dragstart={handle_dragStart}
				 on:mousedown={({button}) => reportResize(button, 'resizeRight')}
				 on:click={resizeEnd}
				 transition:fade>
			<span>resize</span>
			<svg height="12" width="12">
				<circle class="grabBlob" cx="6" cy="6" r="5" fill="green"/>
			</svg>
		</div>
	{/if}
	<slot></slot>
</div>



<style>

	circle {
		stroke: grey;
		stroke-width: 1;
	}

	.tile {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		border: solid;
		border-color: grey;
		border-width: 1px;
		border-radius: 5px;
		box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.3);
		background: white;
	}

	#dragBar {
		/* isolation: isolate; */
		z-index: 1000;
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 2px;
		left: 2px;
		border-radius: 5px;
		background: linen;
		opacity: 0.8;
		font-family: Ubuntu, Comfortaa, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Cantarell, "Helvetica Neue", sans-serif;
		font-size: 0.8em;
	}

	#dragBar span {
		vertical-align: top;
		user-select: none;
	}

	.grabBlob {
		cursor: grab;		
	}
	
	.pointBlob {
		cursor: pointer;		
	}
	
	.resizeBlob {
		z-index: 2000;
		font-family: Ubuntu, Comfortaa, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Cantarell, "Helvetica Neue", sans-serif;
		font-size: 0.8em;
		color: grey;
		user-select: none;
	}

	.resizeBlob.topRight {
		position: absolute;
		top: 2px;
		right: 1px;
		vertical-align: top;
	}

	.resizeBlob.resizeLeft {
		position: absolute;
		bottom: -2px;
		left: 1px;
		vertical-align: bottom;
	}

	.resizeBlob.resizeRight {
		position: absolute;
		bottom: -2px;
		right: 1px;
		vertical-align: bottom;
	}
</style>
