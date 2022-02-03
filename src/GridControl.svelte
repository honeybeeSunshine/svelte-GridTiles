<script>
import { unlockTiles, currentLayout } from './stores.js';
import { tileTypes } from './layout.js';

let tileToAdd = null;

function toggleLock () {
  unlockTiles.set(!$unlockTiles);
}

function addTile () {
  let newKey = $currentLayout.reduce((l, d) => { return ((d.key > l) ? d.key : l) }, 0)+1;
  if (tileToAdd) {
    $currentLayout = [...$currentLayout,
      { "key": newKey,
        "type": tileToAdd,
        "position": {"colStart": 1, "colEnd": 6, "rowStart": 3, "rowEnd": 9, "zIndex": 2000}
      }
    ]
    if (!$unlockTiles) toggleLock();
  }
}

</script>

<div>
  <button  id="lock" on:click={toggleLock}>{($unlockTiles ? 'lock' : 'unlock')}</button>
</div>
<div>
  <button on:click={addTile}>add Tile</button>
  <select id="addTile" bind:value={tileToAdd}>
    <option value={null}>--choose tile type--</option>
    {#each tileTypes as {name, component}}
    <option value={component}>{name}</option>
    {/each}
  </select>
</div>



<style>
</style>
