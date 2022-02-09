<script>
	import Tile from "./Tile.svelte";
	import { layout } from "./layout.js";
	import { unlockTiles, showDrops, dropTarget, currentLayout, dragOrigin } from "./stores.js";
	import { fade } from 'svelte/transition';

	currentLayout.set(layout)

	let totalHeight;
	let totalWidth;
	$: cols = Math.floor(totalWidth/45);
	$: rows = Math.floor(totalHeight/36);
	$: cssStyleGrid = `grid-template-columns: repeat(${cols}, 1fr);
										 grid-template-rows: repeat(${rows}, 30px);`

	//create arrays of valid drop spots for drag and drop
	$: colArray = Array.from({length: cols}, (v, i) => i+1); //Array.from('0'.repeat(cols))
	$: rowArray = Array.from({length: rows}, (v, i) => i+1); //Array.from('0'.repeat(rows))
	let colLooper = colArray;
	let rowLooper = rowArray;
	$: if ($showDrops) {
			if ($showDrops[0] === 'move') {
				colLooper = colArray.slice(0,cols-$showDrops[1][1]+1);
				rowLooper = rowArray.slice(0,rows-$showDrops[1][0]+1);
			} else if ($showDrops[0] === 'resizeLeft') {
				colLooper = colArray.slice(0,$showDrops[1][1]-2);
				rowLooper = rowArray.slice($showDrops[1][0]);
			} else if ($showDrops[0] === 'resizeRight') {
				colLooper = colArray.slice($showDrops[1][1]);
				rowLooper = rowArray.slice($showDrops[1][0]);
			}
		}



	function handleDrop (e) {
		let target = e.target;
		if (target.nodeName === 'svg')	{	//occasionally it reports the outer element
			target = target.firstChild;
			console.log(e);
		}
		target.setAttribute('fill', 'white');
		dropTarget.set(target.id);
	}

	function fillDrop (e) {
		e.preventDefault();
		e.target.setAttribute('fill', 'black');
	}

	function closeTile(key) {
		let newLayout = $currentLayout.filter((d) => {
				return (d.key != key)
		})
		currentLayout.set(newLayout)
	}

	function adjustTile(e, key) {
		let index = $currentLayout.findIndex( (d) => {
				if (d.key == key) return true;
		})
		$currentLayout[index].position = e.detail;
	}

</script>

<!-- why does this still work if we're not the full size of the window? -->
<svelte:window bind:innerHeight={totalHeight} bind:innerWidth={totalWidth} />

<div id="tileGrid" style={cssStyleGrid}>
<!-- <div id="tileGrid" style={cssStyleGrid} bind:clientHeight={totalHeight} bind:clientWidth={totalWidth}> -->
	{#if ($unlockTiles && $showDrops)}
		{#each rowLooper as r}
			{#each colLooper as c}
				{#if ($dragOrigin != (r+'-'+c))}
					<div class="dropDiv" style={`grid-column-start: ${c}; grid-row-start: ${r};`}>
						<svg class={"drop "+$showDrops[0]}
							on:drop={handleDrop}
							on:dragenter={fillDrop}
							on:dragover={fillDrop}
							on:dragleave={(e) => e.target.setAttribute('fill', 'white')}
							on:mouseup={() => {showDrops.set(false)}}
							height="12" width="12"
							transition:fade>
							<circle id={r+'-'+c}
								cx="6" cy="6" r="5" stroke="grey" stroke-width="1" fill="white"/>
						</svg>
					</div>
				{/if}
			{/each}
		{/each}
	{/if}
	{#each $currentLayout as tile (tile.key)}
		<Tile {...tile.position} on:destroy={()=>closeTile(tile.key)} on:adjust={(e)=>adjustTile(e, tile.key)}>
			<svelte:component this={tile.type} />
		</Tile>
	{/each}
</div>



<style>
	#tileGrid {
		position: relative;
		display: grid;
		grid-gap: 0.3em;
		background: linen;
	}

	.dropDiv {
		z-index: 3000;
		position: relative;
	}

	.drop {
		position: absolute;
	}

	.drop.move {
		top: 2px;
		left: 2px;
	}

	.drop.resizeLeft {
		bottom: 2px;
		left: 2px;
	}

	.drop.resizeRight {
		bottom: 2px;
		right: 2px;
	}
</style>
