export function renderFilter(container: HTMLElement) {
  const filterHTML = `
      <div class="filters-main">
        <div id="filters">
          <div class="left_img_button" id="slideButton" style="display: none;">
            <i class="fa-solid fa-angle-left"></i>
          </div>
          <a href="/listings/">
            <div class="filter ALL ps-2 pe-2">
              <div><img src="/Icon/0.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p style="text-decoration: none;">ALL</p>
            </div>
          </a>
          <a href="/listings/filter/Beachfront">
            <div class="filter Beachfront">
              <div><img src="/Icon/1.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Beachfront</p>
            </div>
          </a>
          <a href="/listings/filter/Cabins">
            <div class="filter Cabins">
              <div><img src="/Icon/2.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>&nbsp;Cabins&nbsp;</p>
            </div>
          </a>
          <a href="/listings/filter/Omg">
            <div class="filter OMG">
              <div><img src="/Icon/3.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>&nbsp;OMG!&nbsp;</p>
            </div>
          </a>
          <a href="/listings/filter/Lake">
            <div class="filter Lake">
              <div><img src="/Icon/4.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>&nbsp;Lake&nbsp;</p>
            </div>
          </a>
          <a href="/listings/filter/Design">
            <div class="filter Design">
              <div><img src="/Icon/5.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>&nbsp;Design&nbsp;</p>
            </div>
          </a>
          <a href="/listings/filter/Amazing Pools">
            <div class="filter Amazing-pools">
              <div><img src="/Icon/6.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Amazing pools</p>
            </div>
          </a>
          <a href="/listings/filter/Farms">
            <div class="filter Farms">
              <div><img src="/Icon/7.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>&nbsp;Farms&nbsp;</p>
            </div>
          </a>
          <a href="/listings/filter/Amazing Views">
            <div class="filter Amazing-views">
              <div><img src="/Icon/8.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Amazing views</p>
            </div>
          </a>
          <a href="/listings/filter/Rooms">
            <div class="filter Rooms">
              <div><img src="/Icon/9.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>&nbsp;Rooms&nbsp;</p>
            </div>
          </a>
          <a href="/listings/filter/Lakefront">
            <div class="filter Lakefront">
              <div><img src="/Icon/10.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Lakefront</p>
            </div>
          </a>
          <a href="/listings/filter/Tiny Homes">
            <div class="filter Tiny-homes">
              <div><img src="/Icon/11.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Tiny homes</p>
            </div>
          </a>
          <a href="/listings/filter/Countryside">
            <div class="filter Countryside">
              <div><img src="/Icon/12.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Countryside</p>
            </div>
          </a>
          <a href="/listings/filter/Treehouse">
            <div class="filter Treehouse">
              <div><img src="/Icon/13.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Treehouse</p>
            </div>
          </a>
          <a href="/listings/filter/Trending">
            <div class="filter Trending">
              <div><img src="/Icon/14.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Trending</p>
            </div>
          </a>
          <a href="/listings/filter/Tropical">
            <div class="filter Tropical">
              <div><img src="/Icon/15.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Tropical</p>
            </div>
          </a>
          <a href="/listings/filter/National Parks">
            <div class="filter National-parks">
              <div><img src="/Icon/16.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>National parks</p>
            </div>
          </a>
          <a href="/listings/filter/Castles">
            <div class="filter Castles">
              <div><img src="/Icon/17.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Castles</p>
            </div>
          </a>
          <a href="/listings/filter/Camping">
            <div class="filter Camping">
              <div><img src="/Icon/18.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Camping</p>
            </div>
          </a>
          <a href="/listings/filter/Top Of The World">
            <div class="filter Top-of-the-world">
              <div><img src="/Icon/19.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Top of the world</p>
            </div>
          </a>
          <a href="/listings/filter/Luxe">
            <div class="filter Luxe">
              <div><img src="/Icon/20.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>&nbsp;Luxe&nbsp;</p>
            </div>
          </a>
          <a href="/listings/filter/Iconic Cities">
            <div class="filter Iconic-cities">
              <div><img src="/Icon/21.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Iconic cities</p>
            </div>
          </a>
          <a href="/listings/filter/Earth Homes">
            <div class="filter Earth-homes">
              <div><img src="/Icon/22.png" alt="icon" style="width: 25px; height: 25px;"></div>
              <p>Earth homes</p>
            </div>
          </a>
          <div class="right_img_button" id="slideButton">
            <i class="fa-solid fa-angle-right"></i>
          </div>
        </div>
        <div class="tax-toggle tax-filter-icon filterIcon me-2 ms-2 " onclick="filterClick()">
          <div class="form-check form-switch form-check-reverse pe-1" style="cursor: pointer;">
            <i class="fa-solid fa-sliders" id="filter-icon"></i>
            <label class="form-check-label" for="filter-icon" style="cursor: pointer;">Filters</label>
          </div>
        </div>
        <div class="tax-toggle tax-filter-icon-small filterIcon me-2 ms-2 " onclick="filterClick()">
          <div class="form-check form-switch form-check-reverse pe-0">
            <i class="fa-solid fa-sliders ps-1" id="filter-icon" style="cursor: pointer;"></i>
          </div>
        </div>
        <div class="tax-toggle tax-filter ">
          <div class="form-check form-switch form-check-reverse" >
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

  container.innerHTML = filterHTML;
}
