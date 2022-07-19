<script>
	import GridTiles from "./GridTiles.svelte";
	import GridControl from "./GridControl.svelte";
</script>

<div id="grid1">
	<div id="toolbar">
		<svelte:component this={GridControl} />
	</div>
	<!-- <div id="grid2"> -->
	<div id="gridTiles">
		<GridTiles />
	</div>
	<!-- </div> -->
</div>

<style>
	#grid1 {
		box-sizing: border-box;
		height: calc(100vh - 16px); /* using default body margin of 8px*/
		/* width: 300vw; */
		position: relative;
		display: grid;
		grid-template-rows: min-content 1fr;
		gap: 0.5em;
		background: linen;
		padding: 0.5em;
	}

	#toolbar {
		display: flex;
		gap: 1em;
		flex-direction: row-reverse;
	}

	/* #grid2 {
		grid-row-start: 2;
		display: grid;
		grid-template-columns: 1fr 7fr;
		background: forestgreen;
	} */

	#gridTiles {
		height: 100%;
		grid-row: 2 / -1;
		background: linen;
	}
</style>
