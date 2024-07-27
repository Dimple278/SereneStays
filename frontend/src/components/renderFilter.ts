export async function renderFilter(container: HTMLElement) {
  const filterHTML = `
    <div class="filters-main">
      <div id="filters">
        <div class="left_img_button" id="slideButton" style="display: none;">
          <i class="fa-solid fa-angle-left"></i>
        </div>
        <div class="filter ALL ps-2 pe-2" data-category="ALL">
          <div><img src="/Icon/0.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p style="text-decoration: none;">ALL</p>
        </div>
        <div class="filter Beachfront" data-category="Beachfront">
          <div><img src="/Icon/1.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Beachfront</p>
        </div>
        <div class="filter Cabins" data-category="Cabins">
          <div><img src="/Icon/2.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>&nbsp;Cabins&nbsp;</p>
        </div>
        <div class="filter OMG" data-category="Omg">
          <div><img src="/Icon/3.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>&nbsp;OMG!&nbsp;</p>
        </div>
        <div class="filter Lake" data-category="Lake">
          <div><img src="/Icon/4.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>&nbsp;Lake&nbsp;</p>
        </div>
        <div class="filter Design" data-category="Design">
          <div><img src="/Icon/5.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>&nbsp;Design&nbsp;</p>
        </div>
        <div class="filter Amazing-pools" data-category="Amazing Pools">
          <div><img src="/Icon/6.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Amazing pools</p>
        </div>
        <div class="filter Farms" data-category="Farms">
          <div><img src="/Icon/7.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>&nbsp;Farms&nbsp;</p>
        </div>
        <div class="filter Amazing-views" data-category="Amazing Views">
          <div><img src="/Icon/8.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Amazing views</p>
        </div>
        <div class="filter Rooms" data-category="Rooms">
          <div><img src="/Icon/9.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>&nbsp;Rooms&nbsp;</p>
        </div>
        <div class="filter Lakefront" data-category="Lakefront">
          <div><img src="/Icon/10.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Lakefront</p>
        </div>
        <div class="filter Tiny-homes" data-category="Tiny Homes">
          <div><img src="/Icon/11.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Tiny homes</p>
        </div>
        <div class="filter Countryside" data-category="Countryside">
          <div><img src="/Icon/12.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Countryside</p>
        </div>
        <div class="filter Treehouse" data-category="Treehouse">
          <div><img src="/Icon/13.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Treehouse</p>
        </div>
        <div class="filter Trending" data-category="Trending">
          <div><img src="/Icon/14.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Trending</p>
        </div>
        <div class="filter Tropical" data-category="Tropical">
          <div><img src="/Icon/15.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Tropical</p>
        </div>
        <div class="filter National-parks" data-category="National Parks">
          <div><img src="/Icon/16.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>National parks</p>
        </div>
        <div class="filter Castles" data-category="Castles">
          <div><img src="/Icon/17.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Castles</p>
        </div>
        <div class="filter Camping" data-category="Camping">
          <div><img src="/Icon/18.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Camping</p>
        </div>
        <div class="filter Top-of-the-world" data-category="Top Of The World">
          <div><img src="/Icon/19.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Top of the world</p>
        </div>
        <div class="filter Luxe" data-category="Luxe">
          <div><img src="/Icon/20.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>&nbsp;Luxe&nbsp;</p>
        </div>
        <div class="filter Iconic-cities" data-category="Iconic Cities">
          <div><img src="/Icon/21.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Iconic cities</p>
        </div>
        <div class="filter Earth-homes" data-category="Earth Homes">
          <div><img src="/Icon/22.png" alt="icon" style="width: 25px; height: 25px;"></div>
          <p>Earth homes</p>
        </div>
        <div class="right_img_button" id="slideButton">
          <i class="fa-solid fa-angle-right"></i>
        </div>
      </div>
      <div class="tax-toggle tax-filter-icon filterIcon me-2 ms-2 ">
        <div class="form-check form-switch form-check-reverse pe-1" style="cursor: pointer;">
          <i class="fa-solid fa-sliders" id="filter-icon"></i>
          <label class="form-check-label" for="filter-icon" style="cursor: pointer;">Filters</label>
        </div>
      </div>
      <div class="tax-toggle tax-filter-icon-small filterIcon me-2 ms-2">
        <div class="form-check form-switch form-check-reverse pe-0">
          <i class="fa-solid fa-sliders ps-1" id="filter-icon" style="cursor: pointer;"></i>
        </div>
      </div>
      <div class="tax-toggle tax-filter">
        <div class="form-check form-switch form-check-reverse">
          <input class="form-check-input tax-switch shadow-none" type="checkbox" role="switch" id="flexSwitchCheckDefault" style="cursor: pointer;">
          <label class="form-check-label changeAfter" for="flexSwitchCheckDefault" style="cursor: pointer; margin-top: 3px;">Display total before taxes</label>
        </div>
      </div>
    </div>
    <div class="tax-toggle tax-sticky">
      <div class="form-check form-switch form-check-reverse">
        <input class="form-check-input tax-switch tax-sticky-sticky shadow-none" type="checkbox" role="switch" id="flexSwitchCheckDefaultS" style="cursor: pointer;">
        <label class="form-check-label changeAfter" for="flexSwitchCheckDefaultS" style="cursor: pointer;">Display total before taxes</label>
      </div>
    </div>
  `;

  // Ensure the HTML is set before adding event listeners
  container.innerHTML = filterHTML;
}
