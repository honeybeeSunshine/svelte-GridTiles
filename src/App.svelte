<script>
	import GridTiles from "./GridTiles.svelte";
	import GridControl from "./GridControl.svelte";
</script>

<main>
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
</main>

<style>
	#grid1 {
		position: relative;
		display: grid;
		grid-template-rows: 1fr 31fr;
		background: linen;
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
		grid-row-start: 2;
		background: linen;
	}

</style>
